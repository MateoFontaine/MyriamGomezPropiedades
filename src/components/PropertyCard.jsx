import { MapPin, Bed, Bath, Ruler, Pencil, Trash2, Download } from "lucide-react";
import { Link } from "react-router-dom";

const PropertyCard = ({
  id,
  image,
  price,
  title,
  address,
  bedrooms,
  bathrooms,
  size,
  type,
  isAdmin = false,
  onEdit,
  onDelete,
  onDownload,          // 👈 NUEVO
}) => {
  // Helpers para que los botones no naveguen a la ruta del <Link>
  const stop = (e) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="relative group">
      <Link to={`/propiedad/${id}`} className="block">
        <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition duration-300 w-full max-w-sm mx-auto overflow-hidden">
          <div className="relative h-48">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {type}
            </span>
            <span className="absolute bottom-2 left-2 bg-white/80 text-pink-600 text-sm font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
              USD {price}
            </span>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <MapPin className="w-4 h-4" /> {address}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" /> {bedrooms}
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" /> {bathrooms}
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" /> {size} m²
              </div>
            </div>
          </div>
        </div>
      </Link>

      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => { stop(e); onEdit?.(id); }}
            className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => { stop(e); onDelete?.(id); }}
            className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => { stop(e); onDownload?.(id); }}
            className="bg-gray-800 text-white p-1 rounded hover:bg-gray-900"
            title="Descargar PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
