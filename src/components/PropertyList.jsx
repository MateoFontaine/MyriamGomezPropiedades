// src/components/PropertyList.jsx
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";

const BASE = import.meta.env?.VITE_API_URL ?? "http://localhost/back-end";

/**
 * Props opcionales:
 * - count: cuántas mostrar (default 8)
 * - onlyTipo: "Venta" | "Alquiler" | null
 * - onlyOportunidad: boolean (true = solo destacadas)
 */
export default function PropertyList({ count = 8, onlyTipo = null, onlyOportunidad = false }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/get_propiedades.php`)
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];

        // normalizamos imagen principal y aplicamos filtros/orden/limite
        let list = arr.map((p) => {
          const imgs = Array.isArray(p.imagenes)
            ? p.imagenes
            : (typeof p.imagenes === "string" && p.imagenes
                ? p.imagenes.split(",").map(s => s.trim()).filter(Boolean)
                : []);
          const firstImg = imgs[0] || p.imagen || "https://via.placeholder.com/800x450?text=Sin+imagen";
          return { ...p, _firstImg: firstImg };
        });

        if (onlyTipo) list = list.filter((p) => p.tipo === onlyTipo);
        if (onlyOportunidad)
          list = list.filter((p) => Number(p.oportunidad) === 1 || p.oportunidad === true || p.oportunidad === "1");

        list.sort((a, b) => Number(b.id) - Number(a.id)); // más recientes primero
        setItems(list.slice(0, count));
      })
      .catch((err) => console.error("Error al cargar propiedades", err));
  }, [count, onlyTipo, onlyOportunidad]);

  return (
    <section className="flex-1 w-full px-6 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Propiedades
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {items.map((p) => (
          <PropertyCard
            key={p.id}
            id={p.id}
            image={p._firstImg}
            price={p.precio}
            title={p.titulo}
            address={p.ubicacion}
            bedrooms={p.dormitorios}
            bathrooms={p["baños"]}
            size={p.superficie}
            type={p.tipo}
          />
        ))}
      </div>

      <div className="flex justify-center items-center mt-8">
        <a
          href="/ventas"
          className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-500 transition duration-200"
        >
          Ver más propiedades
        </a>
      </div>
    </section>
  );
}
