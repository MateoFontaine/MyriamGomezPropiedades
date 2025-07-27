import { useEffect, useState } from "react"
import Header from "./components/Header"
import Banner from "./components/Banner" 
import PropertyCard from "./components/PropertyCard"

function App() {
  const [propiedades, setPropiedades] = useState([])

  useEffect(() => {
    fetch("http://localhost:3001/api/propiedades")
      .then((res) => res.json())
      .then((data) => setPropiedades(data))
      .catch((err) => console.error("Error al cargar propiedades", err))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
  <Header />
  <Banner />


  <main className="flex-1 w-full px-6 py-8">
    <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
      Propiedades en venta
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {propiedades.map((prop) => (
        <PropertyCard
          key={prop.id}
          id={prop.id}
          titulo={prop.titulo}
          ubicacion={prop.ubicacion}
          precio={prop.precio}
          imagen={prop.imagen}
        />
      ))}
    </div>
  </main>
</div>

  )
}

export default App
