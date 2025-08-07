import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PropiedadDetalle() {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/back-end/get_propiedad.php?id=${id}`)
      .then(res => res.json())
      .then(data => setPropiedad(data))
      .catch(err => console.error("Error al cargar propiedad", err));
  }, [id]);

  if (!propiedad) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto mt-20 px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">{propiedad.titulo}</h1>

        <img
          src={propiedad.imagen}
          alt={propiedad.titulo}
          className="w-full h-[400px] object-cover rounded-xl shadow"
        />

        <div className="text-gray-600 text-sm">
          <p><strong>Ubicación:</strong> {propiedad.ubicacion}</p>
          <p><strong>Tipo:</strong> {propiedad.tipo}</p>
          <p><strong>Dormitorios:</strong> {propiedad.dormitorios}</p>
          <p><strong>Baños:</strong> {propiedad.baños}</p>
          <p><strong>Superficie:</strong> {propiedad.superficie} m²</p>
          <p><strong>Precio:</strong> <span className="text-pink-600 font-semibold text-lg">USD {propiedad.precio}</span></p>
          <p><strong>Descripción:</strong> {propiedad.descripcion || "Sin descripción disponible."}</p>
        </div>

        <div className="w-full h-[300px] mt-6">
          <iframe
            className="w-full h-full rounded-lg border"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(propiedad.ubicacion)}&output=embed`}
          ></iframe>
        </div>
        <div className="mt-8 bg-white border rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Te interesa esta propiedad?</h3>
    <p className="text-gray-600 text-sm">Contactanos por WhatsApp para más info o agendar una visita.</p>
  </div>
  <a
    href={`https://wa.me/5492267444899?text=Hola! Estoy interesado en la propiedad: ${encodeURIComponent(propiedad.titulo)} ubicada en ${encodeURIComponent(propiedad.ubicacion)}.`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-pink-600 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-500 transition"
  >
    Consultar por WhatsApp
  </a>
</div>
      </div>

      
      <Footer />
    </>
  );
}

export default PropiedadDetalle;
