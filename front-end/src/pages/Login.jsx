import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import logo from "../assets/logo.png"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    // Simulación de login
    const users = [
      { email: "admin@myriamgomez.com", password: "admin123", role: "admin" },
      { email: "superadmin@myriamgomez.com", password: "admin123", role: "superadmin" },
    ]

    const foundUser = users.find(u => u.email === email && u.password === password)

    if (foundUser) {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userName", foundUser.email)
      localStorage.setItem("userRole", foundUser.role)
      navigate("/admin-myriam-panel-78yNhd")
    } else {
      setError("Credenciales incorrectas")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 sm:p-10 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 ">Panel de Administración</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Contraseña</label>
          <input
            type="password"
            placeholder="Tu contraseña"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition text-sm font-medium"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  )
}

export default Login
