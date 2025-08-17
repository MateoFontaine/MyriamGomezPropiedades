import { useState } from "react";

export default function PropertyGallery({ imagenes = [], imagen = "" }) {
  const pics = (Array.isArray(imagenes) && imagenes.length ? imagenes : (imagen ? [imagen] : []))
    .filter(Boolean);
  const [i, setI] = useState(0);

  if (!pics.length) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-gray-100 grid place-items-center text-gray-500">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <img
        src={pics[i]}
        alt={`Imagen ${i+1}`}
        className="w-full h-[400px] object-cover rounded-xl shadow"
      />
      {pics.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {pics.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-20 min-w-28 border rounded-md overflow-hidden ${i===idx ? "ring-2 ring-pink-500" : ""}`}
              title={`Imagen ${idx+1}`}
            >
              <img src={src} alt={`thumb ${idx+1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
