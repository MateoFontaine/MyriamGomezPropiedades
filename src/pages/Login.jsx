import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Auth } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await Auth.login(email, password);
      if (!["admin", "superadmin"].includes(user.role)) {
        setError("Tu usuario no tiene permisos para entrar al panel.");
        await Auth.logout();
        return;
      }
      navigate("/admin-myriam-panel-78yNhd");
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 sm:p-10 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Logo myriam gomez" className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">
          Panel de Administración
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            Contraseña
          </label>
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
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-500 transition text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <div className="text-center text-xs text-gray-500">
          <Link to="/" className="hover:underline">
            Volver al sitio
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
