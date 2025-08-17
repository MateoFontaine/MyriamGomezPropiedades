import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Gallery({
  images = [],             // array de URLs
  initialIndex = 0,        // índice inicial
  className = "",          // clases extra para el wrapper
  heightClass = "h-96 md:h-[500px]", // alto del visor principal
  showThumbs = true,       // mostrar miniaturas
}) {
  const pics = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [idx, setIdx] = useState(Math.min(initialIndex, Math.max(0, pics.length - 1)));
  const [open, setOpen] = useState(false);
  const touchStartX = useRef(null);

  // Nav
  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === pics.length - 1 ? 0 : i + 1));

  // Swipe mobile
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    const s = touchStartX.current;
    if (s == null) return;
    const d = e.changedTouches[0].clientX - s;
    if (Math.abs(d) > 40) (d > 0 ? prev() : next());
    touchStartX.current = null;
  };

  // Teclado cuando el modal está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pics.length]);

  if (!pics.length) {
    return (
      <div className={`w-full ${heightClass} rounded-lg bg-gray-100 grid place-items-center text-gray-500 ${className}`}>
        Sin imagen
      </div>
    );
  }

  return (
    <section className={` ${className}`}>
      {/* Visor principal */}
      <div className={`relative mb-6 rounded-lg overflow-hidden cursor-pointer ${heightClass}`}
           onClick={() => setOpen(true)}
           onTouchStart={onTouchStart}
           onTouchEnd={onTouchEnd}>
        <div className="absolute inset-0">
          <img
            src={pics[idx]}
            alt={`Imagen ${idx + 1}`}
            className="w-full h-full object-cover"
            onError={(e)=>{ e.currentTarget.src = "https://via.placeholder.com/1200x675?text=Imagen+no+disponible"; }}
            draggable={false}
          />
        </div>

        {/* Flechas */}
        {pics.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e)=>{ e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              type="button"
              onClick={(e)=>{ e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Contador */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {idx + 1} / {pics.length}
        </div>
      </div>

      {/* Miniaturas */}
      {showThumbs && pics.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {pics.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative h-20 rounded-lg overflow-hidden transition-all ${i === idx ? "ring-2 ring-amber-800 scale-105" : "hover:scale-105"}`}
              aria-label={`Ir a imagen ${i+1}`}
            >
              <img src={src} alt={`thumb ${i+1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Modal ampliado */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] h-full">
            <img
              src={pics[idx]}
              alt={`Ampliada ${idx + 1}`}
              className="w-full h-full object-contain"
              draggable={false}
            />

            <button
              onClick={(e)=>{ e.stopPropagation(); setOpen(false); }}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Flechas en modal */}
            {pics.length > 1 && (
              <>
                <button
                  onClick={(e)=>{ e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e)=>{ e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
