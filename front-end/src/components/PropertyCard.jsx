import { Link } from "react-router-dom"

function PropertyCard({ id, titulo, ubicacion, precio, imagen }) {
  return (
    <Link to={`/propiedad/${id}`} className="block">
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
        <img
          src={imagen}
          alt={titulo}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{titulo}</h2>
          <p className="text-gray-600">{ubicacion}</p>
          <p className="text-green-600 font-bold mt-2">
            ${precio.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
