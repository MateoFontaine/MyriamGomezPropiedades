import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, PieChart, Building2, PlusCircle } from "lucide-react";
import logo from "../assets/logo.png";
import PropertyCard from "../components/PropertyCard";

const CATEGORIAS = ["Casa","Departamento","Lote","Galpón","Local","PH","Cabaña"];
const SERVICIOS = ["Luz","Gas","Agua","WiFi"];
const CARACS    = ["Pileta","Parrilla","Cochera","Jardín","Amoblado","Apto mascotas"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const baseURL = "http://localhost/back-end";

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
  const [baños, setBaños] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [oportunidad, setOportunidad] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) navigate("/login");
    fetchPropiedades();
  }, [navigate]);

  const fetchPropiedades = async () => {
    try {
      const res = await fetch(`${baseURL}/get_propiedades.php`);
      const data = await res.json();
      setPropiedades(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const toArray = (v) => Array.isArray(v) ? v : (v ? String(v).split(",").map(s=>s.trim()).filter(Boolean) : []);
  const toggleInArray = (val, arr, setter) =>
    setter(arr.includes(val) ? arr.filter(v=>v!==val) : [...arr, val]);

  const limpiarCampos = () => {
    setTitulo(""); setUbicacion(""); setPrecio(""); setTipo("Venta"); setCategoria("");
    setDormitorios(""); setBaños(""); setSuperficie(""); setImagen("");
    setDescripcion(""); setOportunidad(false); setServicios([]); setCaracteristicas([]);
    setPropiedadActual(null); setModoEdicion(false);
  };

  const abrirCrear = () => { limpiarCampos(); setMostrarModal(true); };
  const abrirEditar = (id) => {
    const p = propiedades.find(x => String(x.id)===String(id));
    if (!p) return;
    setTitulo(p.titulo||""); setUbicacion(p.ubicacion||""); setPrecio(p.precio||"");
    setTipo(p.tipo||"Venta"); setCategoria(p.categoria||"");
    setDormitorios(p.dormitorios??""); setBaños(p.baños??""); setSuperficie(p.superficie??"");
    setImagen(p.imagen||""); setDescripcion(p.descripcion||"");
    setOportunidad(!!Number(p.oportunidad));
    setServicios(toArray(p.servicios)); setCaracteristicas(toArray(p.caracteristicas));
    setPropiedadActual(p); setModoEdicion(true); setMostrarModal(true);
  };
  const cerrarModal = () => { setMostrarModal(false); limpiarCampos(); };

  const filtrarPor = (t) =>
    propiedades.filter(p =>
      p.tipo===t &&
      (p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
       p.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()))
    );

  const ventas = useMemo(()=>filtrarPor("Venta"), [propiedades,busqueda]);
  const alquileres = useMemo(()=>filtrarPor("Alquiler"), [propiedades,busqueda]);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar propiedad?")) return;
    const res = await fetch(`${baseURL}/eliminar_propiedad.php?id=${id}`, { method:"DELETE" });
    if (!res.ok) return alert("Error al eliminar");
    setPropiedades(prev => prev.filter(p => String(p.id)!==String(id)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      titulo, ubicacion, precio, tipo, categoria,
      dormitorios, baños, superficie, imagen, descripcion,
      oportunidad, servicios, caracteristicas
    };

    try {
      if (modoEdicion && propiedadActual?.id) {
        // EDITAR: usamos POST (muchos hostings bloquean PUT)
        const res = await fetch(`${baseURL}/editar_propiedad.php?id=${propiedadActual.id}`, {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("No se pudo editar");
        setPropiedades(prev => prev.map(p => String(p.id)===String(propiedadActual.id) ? { ...p, ...payload } : p));
      } else {
        const res = await fetch(`${baseURL}/crear_propiedad.php`, {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("No se pudo crear");
        const data = await res.json(); // {id, cod}
        setPropiedades(prev => [...prev, { id: data.id, cod: data.cod, ...payload }]);
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
            <button onClick={()=>setSeccion("estadisticas")} className={`flex items-center gap-2 ${seccion==="estadisticas"?"font-bold text-pink-600":"text-gray-700 hover:text-pink-600"}`}>
              <PieChart className="w-5 h-5"/><span>Estadísticas</span>
            </button>
            <button onClick={()=>setSeccion("venta")} className={`flex items-center gap-2 ${seccion==="venta"?"font-bold text-pink-600":"text-gray-700 hover:text-pink-600"}`}>
              <Home className="w-5 h-5"/><span>Propiedades en Venta</span>
            </button>
            <button onClick={()=>setSeccion("alquiler")} className={`flex items-center gap-2 ${seccion==="alquiler"?"font-bold text-pink-600":"text-gray-700 hover:text-pink-600"}`}>
              <Building2 className="w-5 h-5"/><span>Propiedades en Alquiler</span>
            </button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button onClick={()=>{localStorage.clear(); navigate("/login");}} className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <LogOut className="w-5 h-5"/><span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 space-y-6">
        {seccion==="estadisticas" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Propiedades</p>
                <h2 className="text-2xl font-bold">{propiedades.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">En Venta</p>
                <h2 className="text-2xl font-bold text-pink-600">{ventas.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">En Alquiler</p>
                <h2 className="text-2xl font-bold text-blue-600">{alquileres.length}</h2>
              </div>
            </div>
          </>
        )}

        {(seccion==="venta" || seccion==="alquiler") && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <input
                type="text" placeholder="Buscar por título o ubicación"
                value={busqueda} onChange={(e)=>setBusqueda(e.target.value)}
                className="px-4 py-2 border rounded-md w-full sm:w-72"
              />
              <button onClick={abrirCrear} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 flex items-center gap-1">
                <PlusCircle className="w-5 h-5"/> Agregar Propiedad
              </button>
            </div>

            <h1 className="text-2xl font-bold text-pink-600">
              {seccion==="venta" ? "Propiedades en Venta" : "Propiedades en Alquiler"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(seccion==="venta" ? ventas : alquileres).map((p)=>(
                <PropertyCard
                  key={p.id}
                  id={p.id}
                  image={p.imagen || "https://via.placeholder.com/800x450?text=Sin+imagen"}
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
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6 relative">
            <button onClick={cerrarModal} className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl">×</button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              {modoEdicion ? "Editar Propiedad" : "Nueva Propiedad"}
            </h2>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <input className="border p-2 rounded w-full" placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} required />
              <input className="border p-2 rounded w-full" placeholder="Ubicación" value={ubicacion} onChange={e=>setUbicacion(e.target.value)} required />
              <input className="border p-2 rounded w-full" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} required />

              <select className="border p-2 rounded w-full" value={tipo} onChange={e=>setTipo(e.target.value)}>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>

              <select className="border p-2 rounded w-full" value={categoria} onChange={e=>setCategoria(e.target.value)}>
                <option value="">Seleccione categoría</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <input type="number" className="border p-2 rounded w-full" placeholder="Dormitorios" value={dormitorios} onChange={e=>setDormitorios(e.target.value)} min="0" />
              <input type="number" className="border p-2 rounded w-full" placeholder="Baños" value={baños} onChange={e=>setBaños(e.target.value)} min="0" />
              <input type="number" className="border p-2 rounded w-full" placeholder="Superficie m²" value={superficie} onChange={e=>setSuperficie(e.target.value)} min="0" />
              
              <input className="border p-2 rounded w-full" placeholder="Imagen URL" value={imagen} onChange={e=>setImagen(e.target.value)} />
              {imagen && (
                <div className="sm:col-span-2">
                  <img
                    src={imagen}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e)=>{ e.currentTarget.src = "https://via.placeholder.com/800x450?text=Sin+imagen"; }}
                  />
                </div>
              )}

              {/* Servicios */}
              <div className="sm:col-span-2 border rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICIOS.map(s => (
                    <label key={s} className={`px-3 py-1 rounded-full border cursor-pointer text-sm ${servicios.includes(s) ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700"}`}>
                      <input type="checkbox" className="sr-only" checked={servicios.includes(s)} onChange={()=>toggleInArray(s, servicios, setServicios)} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div className="sm:col-span-2 border rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Características</p>
                <div className="flex flex-wrap gap-2">
                  {CARACS.map(c => (
                    <label key={c} className={`px-3 py-1 rounded-full border cursor-pointer text-sm ${caracteristicas.includes(c) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"}`}>
                      <input type="checkbox" className="sr-only" checked={caracteristicas.includes(c)} onChange={()=>toggleInArray(c, caracteristicas, setCaracteristicas)} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              {/* Oportunidad */}
              <div className="sm:col-span-2 flex items-center justify-between border rounded p-3">
                <span className="text-sm text-gray-700 font-medium">Marcar como Oportunidad</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" checked={oportunidad} onChange={(e)=>setOportunidad(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"
                    style={{boxShadow:"inset 0 0 0 2px rgba(0,0,0,0.05)"}} />
                </label>
              </div>

              <div className="sm:col-span-2">
                <textarea className="border p-2 rounded w-full resize-none" rows={4} placeholder="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-2">
                <button type="button" onClick={cerrarModal} className="px-6 py-2 rounded border text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-500">
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
