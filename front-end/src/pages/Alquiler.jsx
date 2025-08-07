// src/pages/Ventas.jsx
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Ventas() {
  const [propiedades, setPropiedades] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("");

  useEffect(() => {
    fetch("http://localhost/back-end/get_propiedades.php")
      .then((res) => res.json())
      .then((data) => setPropiedades(data))
      .catch((err) => console.error("Error al cargar propiedades", err));
  }, []);

  // Acá vas a ir filtrando propiedades (por ahora básico)
  const propiedadesFiltradas = propiedades.filter((prop) => {
    return (
      (filtroTipo ? prop.tipo === filtroTipo : true) &&
      (filtroUbicacion ? prop.ubicacion === filtroUbicacion : true)
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto py-10 px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Propiedades en Alquiler
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtros */}
            <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Filtros</h2>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Tipo de Propiedad</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Ubicación</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  value={filtroUbicacion}
                  onChange={(e) => setFiltroUbicacion(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Costa Atlántica">Costa Atlántica</option>
                  <option value="Costa Esmeralda">Costa Esmeralda</option>
                  <option value="Valeria Del Mar">Valeria Del Mar</option>
                </select>
              </div>

              <button className="mt-6 w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-500 transition duration-200">
                Aplicar Filtros
              </button>
            </aside>

            {/* Lista propiedades */}
            <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propiedadesFiltradas.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  id={prop.id}
                  image={prop.imagen}
                  price={prop.precio}
                  title={prop.titulo}
                  address={prop.ubicacion}
                  bedrooms={prop.dormitorios}
                  bathrooms={prop.baños}
                  size={prop.superficie}
                  type={prop.tipo}
                />
              ))}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Ventas;
