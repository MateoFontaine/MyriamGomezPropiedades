// src/components/Banner.jsx
import { useEffect, useRef, useState } from "react";

export default function Banner() {
  const [ready, setReady] = useState(false);      // difiere la carga de las fuentes
  const videoRef = useRef(null);
  const contRef  = useRef(null);

  // 1) Cargar las <source> del video recién cuando el navegador esté “idle”
  useEffect(() => {
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: 1200 });
    } else {
      setTimeout(start, 800);
    }
  }, []);

  // 2) Pausar el video cuando no está visible (ahorra CPU/móvil)
  useEffect(() => {
    const el = contRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={contRef} className="relative w-full h-[75vh] min-h-[420px] overflow-hidden">
      {/* Poster liviano visible al toque (100 KB aprox.) */}
      <img
        src="/VideoPinamar-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Video se monta solo cuando ready=true, y no se pre-descarga */}
      {ready && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0"
          onLoadedData={(e) => (e.currentTarget.style.opacity = 1)}
          autoPlay
          muted
          loop
          playsInline
          preload="none"                    // 👈 clave: no descarga en el primer render
          poster="/VideoPinamar-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* Si podés generar un .webm, ponelo primero (más liviano). Si no, dejá solo el mp4 */}
          <source src="/VideoPinamar.webm" type="video/webm" />
          <source src="/VideoPinamar.mp4"  type="video/mp4"  />
        </video>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40 backdrop-blur-sm px-4">
        <h2 className="text-white text-3xl sm:text-4xl font-semibold mb-6 text-center">
          Encontrá tu próxima propiedad
        </h2>

        <form className="bg-white/20 backdrop-blur-lg p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
          <select className="p-2 rounded-md bg-white text-sm">
            <option>Tipo de Propiedad</option>
            <option>Casa</option>
            <option>Departamento</option>
          </select>
          <select className="p-2 rounded-md bg-white text-sm">
            <option>Dormitorios</option>
            <option>1</option>
            <option>2</option>
            <option>3+</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por ubicación o código"
            className="p-2 rounded-md bg-white text-sm"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md font-semibold transition"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
