import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery"; // carrusel con <img>

const BASE = import.meta.env?.VITE_API_URL ?? "http://localhost/back-end";

export default function PropiedadDetalle() {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true); setError(""); setPropiedad(null);
      try {
        if (!id) throw new Error("Falta el ID en la URL");
        const res = await fetch(`${BASE}/get_propiedad.php?id=${id}`);
        const text = await res.text();
        let data;
        try { data = text ? JSON.parse(text) : null; } catch { throw new Error("Respuesta no válida del servidor"); }
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        if (!abort) setPropiedad(data);
      } catch (e) {
        if (!abort) setError(e.message || "Error cargando la propiedad");
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center mt-24">Cargando...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto mt-24 px-6">
          <p className="text-red-600 font-semibold">No se pudo cargar la propiedad: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!propiedad) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto mt-24 px-6">
          <p>No se encontró la propiedad.</p>
        </div>
        <Footer />
      </>
    );
  }

  // Normalizo imágenes (array / CSV / única)
  const imgs =
    Array.isArray(propiedad?.imagenes) && propiedad.imagenes.length
      ? propiedad.imagenes
      : (typeof propiedad?.imagenes === "string" && propiedad.imagenes
          ? propiedad.imagenes.split(",").map(s => s.trim()).filter(Boolean)
          : (propiedad?.imagen ? [propiedad.imagen] : [])
        );

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto mt-20 px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{propiedad.titulo}</h1>

            {/* Galería más chica */}
            <Gallery images={imgs} heightClass="h-64 md:h-80" />

            {/* Ficha principal */}
            <div className="bg-white border rounded-xl p-5 space-y-2">
              <p><strong>Tipo:</strong> {propiedad.tipo}</p>
              <p><strong>Categoría:</strong> {propiedad.categoria || "—"}</p>
              <p><strong>Dormitorios:</strong> {propiedad.dormitorios}</p>
              <p><strong>Baños:</strong> {propiedad["baños"]}</p>
              <p><strong>Superficie:</strong> {propiedad.superficie} m²</p>
              <p>
                <strong>Precio:</strong>{" "}
                <span className="text-pink-600 font-semibold text-lg">USD {propiedad.precio}</span>
              </p>
              <p className="pt-2">
                <strong>Descripción:</strong>{" "}
                {propiedad.descripcion || "Sin descripción disponible."}
              </p>
            </div>
          </div>

          {/* Aside derecho */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Ubicación (sticky) */}
            <div className="bg-white border rounded-xl p-5  top-24">
              <h3 className="text-lg font-semibold mb-2">Ubicación</h3>
              <p className="text-sm text-gray-600 mb-3">{propiedad.ubicacion}</p>
              <div className="w-full h-56 rounded-lg overflow-hidden border">
                <iframe
                  className="w-full h-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(propiedad.ubicacion || "")}&output=embed`}
                  title="Mapa"
                />
              </div>
            </div>

            {/* Ficha rápida (opcional) */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-3">Ficha rápida</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {propiedad.cod && <li><strong>COD:</strong> {propiedad.cod}</li>}
                {!!propiedad.oportunidad && <li className="text-pink-600"><strong>Oportunidad</strong></li>}
                {Array.isArray(propiedad.servicios) && propiedad.servicios.length > 0 && (
                  <li><strong>Servicios:</strong> {propiedad.servicios.join(", ")}</li>
                )}
                {Array.isArray(propiedad.caracteristicas) && propiedad.caracteristicas.length > 0 && (
                  <li><strong>Características:</strong> {propiedad.caracteristicas.join(", ")}</li>
                )}
              </ul>
            </div>

            {/* Contacto (sticky, debajo del mapa) */}
            <div className="bg-white border rounded-xl p-5  top-[calc(24px+16rem+1rem)]">
              <h3 className="text-lg font-semibold mb-2">Contacto</h3>
              <a
                href={`https://wa.me/5492267444899?text=Hola! Estoy interesado en la propiedad: ${encodeURIComponent(propiedad.titulo || "")} ubicada en ${encodeURIComponent(propiedad.ubicacion || "")} | Codigo: ${encodeURIComponent(propiedad.cod  || "")}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-pink-600 text-white px-4 py-2 rounded-full font-medium hover:bg-pink-500 transition"
              >
                Consultar por WhatsApp
              </a>
            </div>

            
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
