// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  LogOut,
  PieChart,
  Building2,
  PlusCircle,
  Star,
} from "lucide-react";
import logo from "../assets/logo.png";
import PropertyCard from "../components/PropertyCard";
import { generatePropertyPDF } from "../utils/propertyPdf";

const CATEGORIAS = [
  "Casa",
  "Departamento",
  "Lote",
  "Galpón",
  "Local",
  "PH",
  "Cabaña",
  "Emprendimiento",
];
const SERVICIOS = ["Luz", "Gas", "Agua", "WiFi"];
const CARACS = [
  "Pileta",
  "Parrilla",
  "Cochera",
  "Jardín",
  "Amoblado",
  "Apto mascotas",
];

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME; // ej: tu_cloud
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET; // ej: inmo_unsigned
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost/back-end";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState("estadisticas");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [propiedadActual, setPropiedadActual] = useState(null);

  const [propiedades, setPropiedades] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // form
  const [titulo, setTitulo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("Venta");
  const [categoria, setCategoria] = useState("");
  const [dormitorios, setDormitorios] = useState("");
  const [banios, setBanios] = useState(""); // sin ñ en estado
  const [superficie, setSuperficie] = useState("");
  const [imagen, setImagen] = useState(""); // principal
  const [imagenes, setImagenes] = useState([]); // URLs Cloudinary
  const [descripcion, setDescripcion] = useState("");
  const [oportunidad, setOportunidad] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);

  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) navigate("/login");
    fetchPropiedades();
  }, [navigate]);

  const fetchPropiedades = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_propiedades.php`);
      const data = await res.json();
      setPropiedades(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const toArray = (v) =>
    Array.isArray(v)
      ? v
      : v
      ? String(v)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const toggleInArray = (val, arr, setter) =>
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const limpiarCampos = () => {
    setTitulo("");
    setUbicacion("");
    setPrecio("");
    setTipo("Venta");
    setCategoria("");
    setDormitorios("");
    setBanios("");
    setSuperficie("");
    setImagen("");
    setImagenes([]);
    setDescripcion("");
    setOportunidad(false);
    setServicios([]);
    setCaracteristicas([]);
    setPropiedadActual(null);
    setModoEdicion(false);
  };

  const abrirCrear = () => {
    limpiarCampos();
    setMostrarModal(true);
  };

  const abrirEditar = (id) => {
    const p = propiedades.find((x) => String(x.id) === String(id));
    if (!p) return;
    setTitulo(p.titulo || "");
    setUbicacion(p.ubicacion || "");
    setPrecio(p.precio || "");
    setTipo(p.tipo || "Venta");
    setCategoria(p.categoria || "");
    setDormitorios(p.dormitorios ?? "");
    setBanios(p.baños ?? "");
    setSuperficie(p.superficie ?? "");

    // imágenes: si tiene array, lo usamos; si no, tomamos la simple
    const imgs = Array.isArray(p.imagenes) ? p.imagenes : toArray(p.imagenes);
    const mainFromDb = p.imagen || (imgs[0] || "");
    const ordered = mainFromDb
      ? [mainFromDb, ...imgs.filter((u) => u !== mainFromDb)]
      : imgs;

    setImagenes(ordered);
    setImagen(mainFromDb || "");
    setDescripcion(p.descripcion || "");
    setOportunidad(!!Number(p.oportunidad));
    setServicios(toArray(p.servicios));
    setCaracteristicas(toArray(p.caracteristicas));
    setPropiedadActual(p);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    limpiarCampos();
  };

  const filtrarPor = (t) =>
    propiedades.filter(
      (p) =>
        p.tipo === t &&
        (p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()))
    );

  const ventas = useMemo(() => filtrarPor("Venta"), [propiedades, busqueda]);
  const alquileres = useMemo(
    () => filtrarPor("Alquiler"),
    [propiedades, busqueda]
  );

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar propiedad?")) return;
    const res = await fetch(`${BASE_URL}/eliminar_propiedad.php?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return alert("Error al eliminar");
    setPropiedades((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  // Descargar PDF (util)
  const handleDownload = async (id) => {
  const p = propiedades.find((x) => String(x.id) === String(id));
  if (!p) return alert("No se encontró la propiedad.");
  try {
    await generatePropertyPDF(p, {
      logoUrl: logo,                             // 👈 tu logo (asset de Vite)
      brandName: "Myriam Gómez Inmobiliaria",   // 👈 nombre comercial
      brandSubtitle: "Mat. CSI 1234",           // 👈 opcional
      contact: { phone: "+54 9 2267 444899", email: "info@codela.dev", web: "codela.dev" },
      // primary: [214,31,105],                 // 👈 si querés cambiar color principal
    });
  } catch (e) {
    console.error(e);
    alert("No se pudo generar el PDF");
  }
};


  // ---- Cloudinary: subir archivos y retornar URLs
  async function uploadToCloudinary(file) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Faltan VITE_CLOUDINARY_NAME o VITE_CLOUDINARY_PRESET en .env"
      );
    }
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", "inmobiliaria/propiedades");
    const res = await fetch(url, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.error?.message || "Error subiendo imagen");
    return data.secure_url;
  }

  async function onSelectImagenes(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSubiendo(true);
    try {
      const urls = [];
      for (const f of files) {
        const u = await uploadToCloudinary(f);
        urls.push(u);
      }
      const nuevas = [...imagenes, ...urls];
      setImagenes(nuevas);
      if (!imagen && nuevas[0]) setImagen(nuevas[0]); // set principal si no hay
    } catch (err) {
      alert(err.message);
    } finally {
      setSubiendo(false);
    }
    e.target.value = "";
  }

  // --- marcar principal y borrar cuidando principal
  function setMainImage(idx) {
    const url = imagenes[idx];
    if (!url) return;
    const ordered = [url, ...imagenes.filter((_, i) => i !== idx)];
    setImagen(url);
    setImagenes(ordered);
  }

  function removeImagenAt(idx) {
    const removed = imagenes[idx];
    const copy = imagenes.filter((_, i) => i !== idx);
    setImagenes(copy);
    if (removed === imagen) {
      setImagen(copy[0] || "");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // garantizar que la principal vaya primera
    const main = imagen || (imagenes[0] || "");
    const orderedImgs = main
      ? [main, ...imagenes.filter((u) => u !== main)]
      : [...imagenes];

    const payload = {
      titulo,
      ubicacion,
      precio: Number(precio || 0),
      tipo,
      categoria,
      dormitorios: Number(dormitorios || 0),
      baños: Number(banios || 0),
      superficie: String(superficie || ""),
      imagen: orderedImgs[0] || "", // principal
      imagenes: orderedImgs, // array ordenado
      descripcion,
      oportunidad: oportunidad ? 1 : 0, // INT para el back
      servicios,
      caracteristicas,
    };

    try {
      if (modoEdicion && propiedadActual?.id) {
        const res = await fetch(
          `${BASE_URL}/editar_propiedad.php?id=${propiedadActual.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error("No se pudo editar");
        await fetchPropiedades(); // refresco desde server
      } else {
        const res = await fetch(`${BASE_URL}/crear_propiedad.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("No se pudo crear");
        await fetchPropiedades();
      }
      cerrarModal();
    } catch (err) {
      alert(err.message || "Error al guardar");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow h-screen sticky top-0 flex flex-col justify-between">
        <div>
          <div className="text-center py-6 border-b flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-16 h-16" />
            <h2 className="text-xl font-bold text-pink-600">Myriam Gómez</h2>
            <p className="text-sm text-gray-500">Panel Admin</p>
          </div>
          <nav className="flex flex-col p-4 space-y-2">
            <button
              onClick={() => setSeccion("estadisticas")}
              className={`flex items-center gap-2 ${
                seccion === "estadisticas"
                  ? "font-bold text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              <PieChart className="w-5 h-5" />
              <span>Estadísticas</span>
            </button>
            <button
              onClick={() => setSeccion("venta")}
              className={`flex items-center gap-2 ${
                seccion === "venta"
                  ? "font-bold text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Propiedades en Venta</span>
            </button>
            <button
              onClick={() => setSeccion("alquiler")}
              className={`flex items-center gap-2 ${
                seccion === "alquiler"
                  ? "font-bold text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Propiedades en Alquiler</span>
            </button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 space-y-6">
        {seccion === "estadisticas" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Propiedades</p>
                <h2 className="text-2xl font-bold">{propiedades.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">En Venta</p>
                <h2 className="text-2xl font-bold text-pink-600">
                  {ventas.length}
                </h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">En Alquiler</p>
                <h2 className="text-2xl font-bold text-blue-600">
                  {alquileres.length}
                </h2>
              </div>
            </div>
          </>
        )}

        {(seccion === "venta" || seccion === "alquiler") && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Buscar por título o ubicación"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-4 py-2 border rounded-md w-full sm:w-72"
              />
              <button
                onClick={abrirCrear}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 flex items-center gap-1"
              >
                <PlusCircle className="w-5 h-5" /> Agregar Propiedad
              </button>
            </div>

            <h1 className="text-2xl font-bold text-pink-600">
              {seccion === "venta"
                ? "Propiedades en Venta"
                : "Propiedades en Alquiler"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(seccion === "venta" ? ventas : alquileres).map((p) => {
                const firstImg =
                  (Array.isArray(p.imagenes) && p.imagenes[0]) ||
                  (typeof p.imagenes === "string" &&
                    p.imagenes.split(",")[0]) ||
                  p.imagen ||
                  "https://via.placeholder.com/800x450?text=Sin+imagen";
                return (
                  <PropertyCard
                    key={p.id}
                    id={p.id}
                    image={firstImg}
                    price={p.precio}
                    title={`${p.titulo}${p.cod ? ` • COD ${p.cod}` : ""}`}
                    address={p.ubicacion}
                    bedrooms={p.dormitorios}
                    bathrooms={p.baños}
                    size={p.superficie}
                    type={p.tipo}
                    isAdmin
                    onEdit={abrirEditar}
                    onDelete={handleDelete}
                    onDownload={handleDownload} // 👈 PDF
                  />
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6 relative">
            <button
              onClick={cerrarModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              {modoEdicion ? "Editar Propiedad" : "Nueva Propiedad"}
            </h2>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              <input
                className="border p-2 rounded w-full"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Ubicación"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                required
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />

              <select
                className="border p-2 rounded w-full"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>

              <select
                className="border p-2 rounded w-full"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Seleccione categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Dormitorios"
                value={dormitorios}
                onChange={(e) => setDormitorios(e.target.value)}
                min="0"
              />
              <input
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Baños"
                value={banios}
                onChange={(e) => setBanios(e.target.value)}
                min="0"
              />
              <input
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Superficie m²"
                value={superficie}
                onChange={(e) => setSuperficie(e.target.value)}
                min="0"
              />

              {/* Campo imagen simple (compat / opcional) */}
              <input
                className="border p-2 rounded w-full"
                placeholder="Imagen principal (URL opcional)"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
              />

              {/* Uploader Cloudinary */}
              <div className="sm:col-span-2 border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    Imágenes (Cloudinary)
                  </p>
                  {subiendo && (
                    <span className="text-xs text-gray-500">Subiendo...</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectImagenes}
                  disabled={subiendo}
                  className="mt-2"
                />

                {!!imagenes.length && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {imagenes.map((u, i) => {
                      const esPrincipal = u === imagen;
                      return (
                        <div
                          key={i}
                          className="relative w-28 h-20 border rounded overflow-hidden"
                        >
                          <img
                            src={u}
                            alt={`img-${i}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Marcar principal */}
                          <button
                            type="button"
                            onClick={() => setMainImage(i)}
                            title={
                              esPrincipal
                                ? "Imagen principal"
                                : "Marcar como principal"
                            }
                            className={`absolute top-1 left-1 rounded-full p-1 text-xs ${
                              esPrincipal
                                ? "bg-yellow-400 text-white"
                                : "bg-white/80 text-gray-700 hover:bg-white"
                            }`}
                          >
                            <Star
                              className={
                                esPrincipal
                                  ? "w-4 h-4 fill-current"
                                  : "w-4 h-4"
                              }
                            />
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => removeImagenAt(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                            title="Eliminar"
                          >
                            x
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Servicios */}
              <div className="sm:col-span-2 border rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Servicios
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICIOS.map((s) => (
                    <label
                      key={s}
                      className={`px-3 py-1 rounded-full border cursor-pointer text-sm ${
                        servicios.includes(s)
                          ? "bg-pink-600 text-white border-pink-600"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={servicios.includes(s)}
                        onChange={() =>
                          toggleInArray(s, servicios, setServicios)
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div className="sm:col-span-2 border rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Características
                </p>
                <div className="flex flex-wrap gap-2">
                  {CARACS.map((c) => (
                    <label
                      key={c}
                      className={`px-3 py-1 rounded-full border cursor-pointer text-sm ${
                        caracteristicas.includes(c)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={caracteristicas.includes(c)}
                        onChange={() =>
                          toggleInArray(c, caracteristicas, setCaracteristicas)
                        }
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              {/* Oportunidad */}
              <div className="sm:col-span-2 flex items-center justify-between border rounded p-3">
                <span className="text-sm text-gray-700 font-medium">
                  Marcar como Oportunidad
                </span>
                <label className="inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={oportunidad}
                    onChange={(e) => setOportunidad(e.target.checked)}
                  />
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors ${
                      oportunidad ? "bg-pink-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        oportunidad ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div className="sm:col-span-2">
                <textarea
                  className="border p-2 rounded w-full resize-none"
                  rows={4}
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-6 py-2 rounded border text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-500"
                  disabled={subiendo}
                >
                  {modoEdicion ? "Guardar cambios" : "Guardar Propiedad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
