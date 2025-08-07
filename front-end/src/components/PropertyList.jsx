import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";

function PropertyList() {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    fetch("http://localhost/back-end/get_propiedades.php")
      .then((res) => res.json())
      .then((data) => setPropiedades(data))
      .catch((err) => console.error("Error al cargar propiedades", err));
  }, []);

  return (
    <section className="flex-1 w-full px-6 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Propiedades
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {propiedades.map((prop) => (
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
      </div>
      <div className="flex justify-center items-center mt-8">
      <a
  href="/ventas"
  rel="noopener noreferrer"
  className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-500 transition duration-200"
>
  Ver mas propiedades
</a>
</div>
    </section>
  );
}

export default PropertyList;
