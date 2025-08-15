import { useEffect, useState, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

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
        slider.on("dragEnded", () => {
          clearInterval(sliderInterval.current);
          sliderInterval.current = setInterval(() => slider.next(), 3000);
        });
        slider.on("destroyed", () => clearInterval(sliderInterval.current));
      },
    ]
  );

  useEffect(() => {
    fetch("http://localhost/back-end/get_propiedades.php")
      .then((res) => res.json())
      .then((data) => {
        setPropiedades(data);
        setTimeout(() => {
          if (sliderInstanceRef.current) {
            sliderInstanceRef.current.update(); //👈 ACTUALIZACIÓN IMPORTANTE
          }
        }, 50); // pequeño delay para esperar que las tarjetas se rendericen
      })
      .catch((err) => console.error("Error al cargar propiedades", err));
  }, [sliderInstanceRef]);

  return (
    <section className="bg-white w-full py-8 px-4 ">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
        Oportunidades
      </h2>
      <div ref={sliderRef} className="keen-slider max-w-7xl mx-auto">
  {propiedades
    .filter((p) => Number(p.oportunidad) === 1 || p.oportunidad === 1 || p.oportunidad === true)
    .map((prop) => (
      <div key={prop.id} className="keen-slider__slide">
        <PropertyCard
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
      </div>
    ))}
</div>

      <div className="flex justify-center items-center mt-8">
      <a
  href="/tu-pagina"
  rel="noopener noreferrer"
  className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-500 transition duration-200"
>
  Ver mas propiedades
</a>
</div>
    </section>
  );
}

export default PropertyCarousel;
