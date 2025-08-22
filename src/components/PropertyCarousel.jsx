import { useEffect, useState, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const BASE = import.meta.env?.VITE_API_URL ?? "http://localhost/back-end";

function PropertyCarousel() {
  const [propiedades, setPropiedades] = useState([]);
  const sliderInterval = useRef(null);

  const [sliderRef, sliderInstanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1, spacing: 10 },
      breakpoints: {
        "(min-width: 640px)": { slides: { perView: 2, spacing: 15 } },
        "(min-width: 1024px)": { slides: { perView: 3, spacing: 20 } },
      },
    },
    [
      (slider) => {
        slider.on("created", () => {
          clearInterval(sliderInterval.current);
          sliderInterval.current = setInterval(() => slider.next(), 3000);
        });
        slider.on("dragStarted", () => clearInterval(sliderInterval.current));
        slider.on("destroyed", () => clearInterval(sliderInterval.current));
      },
    ]
  );

  useEffect(() => {
    // si tu back soporta filtros, mejor pedir solo oportunidades:
    const url = `${BASE}/get_propiedades.php?oportunidad=1&limit=12`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setPropiedades(arr);
        // actualizar el slider cuando haya slides
        setTimeout(() => {
          if (sliderInstanceRef.current) sliderInstanceRef.current.update();
        }, 0);
      })
      .catch((err) => console.error("Error al cargar propiedades", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderInstanceRef]);

  return (
    <section className="bg-white w-full py-8 px-4 ">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
        Oportunidades
      </h2>

      <div ref={sliderRef} className="keen-slider max-w-7xl mx-auto">
        {propiedades.map((prop) => {
          const firstImg =
            (Array.isArray(prop.imagenes) && prop.imagenes[0]) ||
            (typeof prop.imagenes === "string" &&
              prop.imagenes.split(",").map(s => s.trim())[0]) ||
            prop.imagen ||
            "https://via.placeholder.com/800x450?text=Sin+imagen";
          return (
            <div key={prop.id} className="keen-slider__slide">
              <PropertyCard
                id={prop.id}
                image={firstImg}
                price={prop.precio}
                title={prop.titulo}
                address={prop.ubicacion}
                bedrooms={prop.dormitorios}
                bathrooms={prop["baños"]}
                size={prop.superficie}
                type={prop.tipo}
              />
            </div>
          );
        })}
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

export default PropertyCarousel;
