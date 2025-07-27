import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

function PropiedadDetalle() {
  const { id } = useParams()
  const [propiedad, setPropiedad] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/api/propiedades`)
      .then((res) => res.json())
      .then((data) => {
        const resultado = data.find((p) => p.id === parseInt(id))
        setPropiedad(resultado)
      })
  }, [id])

  if (!propiedad) return <p className="p-8">Cargando propiedad...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{propiedad.titulo}</h1>
      <img
        src={propiedad.imagen}
        alt={propiedad.titulo}
        className="w-full max-w-xl rounded-lg shadow-md"
      />
      <p className="mt-4 text-gray-600">{propiedad.ubicacion}</p>
      <p className="mt-2 text-green-600 text-xl font-bold">
        ${propiedad.precio.toLocaleString()}
      </p>
    </div>
  )
}

export default PropiedadDetalle
