import { useEffect, useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import PropertyCard from "./components/PropertyCard";
import SobreNosotros from "./components/SobreNosotros";
import Contacto from "./components/Contacto";
import Footer from "./components/Footer";

function App() {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    fetch("http://localhost/back-end/get_propiedades.php")
      .then((res) => res.json())
      .then((data) => setPropiedades(data))
      .catch((err) => console.error("Error al cargar propiedades", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Banner />
      <main className="flex-1 w-full px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Propiedades en venta
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
          {propiedades.map((prop) => (
            <PropertyCard
              key={prop.id}
              id={prop.id}
              image={prop.imagen} // imagen principal
              price={prop.precio}
              title={prop.titulo}
              address={prop.ubicacion}
              bedrooms={prop.dormitorios}
              bathrooms={prop.baños}
              size={prop.superficie}
              type={prop.tipo}
            />
          ))}
        </div>
      </main>
      <SobreNosotros />
      <Contacto />
      <Footer />
    </div>
  );
}

export default App;
