import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, LogOut, PieChart, Building2, PlusCircle } from "lucide-react"
import logo from "../assets/logo.png"
import PropertyCard from "../components/PropertyCard"
import LocationPicker from "../components/LocationPicker";

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState("estadisticas")
  const [propiedades, setPropiedades] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) navigate("/login")

    fetch("http://localhost/back-end/get_propiedades.php")
      .then((res) => res.json())
      .then((data) => setPropiedades(data))
      .catch((err) => console.error("Error al cargar propiedades", err))
  }, [navigate])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const filtrarPor = (tipo) => {
    return propiedades.filter(
      (p) =>
        p.tipo === tipo &&
        (p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.ubicacion.toLowerCase().includes(busqueda.toLowerCase()))
    )
  }

  const [titulo, setTitulo] = useState("")
const [ubicacion, setUbicacion] = useState("")
const [precio, setPrecio] = useState("")
const [tipo, setTipo] = useState("Venta")
const [dormitorios, setDormitorios] = useState("")
const [baños, setBaños] = useState("")
const [superficie, setSuperficie] = useState("")
const [imagen, setImagen] = useState("")
const [descripcion, setDescripcion] = useState("")

const limpiarCampos = () => {
  setTitulo("")
  setUbicacion("")
  setPrecio("")
  setTipo("Venta")
  setDormitorios("")
  setBaños("")
  setSuperficie("")
  setImagen("")
  setDescripcion("")
}

  const ventas = filtrarPor("Venta")
  const alquileres = filtrarPor("Alquiler")

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow h-screen sticky top-0 flex flex-col justify-between">
        <div>
          <div className="text-center py-6 border-b flex flex-col justify-center items-center">
            <img src={logo} alt="Logo" className="w-16 h-16" />
            <h2 className="text-xl font-bold text-pink-600">Myriam Gómez</h2>
            <p className="text-sm text-gray-500">Panel Admin</p>
          </div>
          <nav className="flex flex-col p-4 space-y-2">
            <button onClick={() => setSeccion("estadisticas")} className={`flex items-center space-x-2 text-gray-700 hover:text-pink-600 ${seccion === "estadisticas" && "font-bold text-pink-600"}`}>
              <PieChart className="w-5 h-5" />
              <span>Estadísticas</span>
            </button>
            <button onClick={() => setSeccion("venta")} className={`flex items-center space-x-2 text-gray-700 hover:text-pink-600 ${seccion === "venta" && "font-bold text-pink-600"}`}>
              <Home className="w-5 h-5" />
              <span>Propiedades en Venta</span>
            </button>
            <button onClick={() => setSeccion("alquiler")} className={`flex items-center space-x-2 text-gray-700 hover:text-pink-600 ${seccion === "alquiler" && "font-bold text-pink-600"}`}>
              <Building2 className="w-5 h-5" />
              <span>Propiedades en Alquiler</span>
            </button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-700">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-6">
        {seccion === "estadisticas" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Propiedades</p>
                <h2 className="text-2xl font-bold text-gray-800">{propiedades.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">En Venta</p>
                <h2 className="text-2xl font-bold text-pink-600">{ventas.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">En Alquiler</p>
                <h2 className="text-2xl font-bold text-blue-600">{alquileres.length}</h2>
              </div>
            </div>
          </>
        )}

        {(seccion === "venta" || seccion === "alquiler") && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por título o ubicación"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="px-4 py-2 border rounded-md w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => setMostrarModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 flex items-center gap-1"
              >
                <PlusCircle className="w-5 h-5" />
                Agregar Propiedad
              </button>
            </div>

            <h1 className="text-2xl font-bold text-pink-600">
              {seccion === "venta" ? "Propiedades en Venta" : "Propiedades en Alquiler"}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(seccion === "venta" ? ventas : alquileres).map((prop) => (
                <PropertyCard
                  key={prop.id}
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
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-lg space-y-4 relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Nueva Propiedad</h2>
            <form
  className="grid grid-cols-1 gap-4"
  onSubmit={async (e) => {
    e.preventDefault()

    const nuevaPropiedad = {
      titulo,
      ubicacion,
      precio,
      tipo,
      dormitorios,
      baños,
      superficie,
      imagen,
      descripcion,
    }

    const res = await fetch("http://localhost/back-end/crear_propiedad.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaPropiedad),
    })

    if (res.ok) {
      const data = await res.json()
      setPropiedades([...propiedades, { id: data.id, ...nuevaPropiedad }])
      setMostrarModal(false)
      limpiarCampos()
    } else {
      alert("Error al guardar la propiedad")
    }
  }}
>
  <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="border p-2 rounded" />
  <input type="text" placeholder="Ubicación" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className="border p-2 rounded" />
  <input type="text" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} className="border p-2 rounded" />
  <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border p-2 rounded">
    <option value="Venta">Venta</option>
    <option value="Alquiler">Alquiler</option>
  </select>
  <input type="number" placeholder="Dormitorios" value={dormitorios} onChange={(e) => setDormitorios(e.target.value)} className="border p-2 rounded" />
  <input type="number" placeholder="Baños" value={baños} onChange={(e) => setBaños(e.target.value)} className="border p-2 rounded" />
  <input type="number" placeholder="Superficie m²" value={superficie} onChange={(e) => setSuperficie(e.target.value)} className="border p-2 rounded" />
  <input type="text" placeholder="Imagen URL" value={imagen} onChange={(e) => setImagen(e.target.value)} className="border p-2 rounded" />
  <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border p-2 rounded" />
  <button type="submit" className="bg-pink-600 text-white py-2 rounded hover:bg-pink-500">
    Guardar Propiedad
  </button>
</form>

          </div>
        </div>
      )}
    </div>
  )
}
