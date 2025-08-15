import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import logo from "../assets/logo.png"

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Logo + descripción */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Myriam Gómez Propiedades" className="h-14 mr-2" />
              <div>
                <h4 className="text-lg font-bold text-white">Myriam Gómez</h4>
                <p className="text-sm text-pink-500">Propiedades</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Tu inmobiliaria de confianza.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Servicios</h5>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link to="/venta" className= "hover:text-pink-500 transition-colors">
                  Venta de Propiedades
                </Link>
              </li>
              <li>
                <Link to="/alquiler" className="hover:text-pink-500 transition-colors">
                  Alquiler de Propiedades
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-pink-500 transition-colors">
                  Tasaciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-500 transition-colors">
                  Asesoramiento
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Contacto</h5>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>+54 11 5459-1954</li>
              <li>myriamgomezpropiedades@gmail.com</li>
              <li>Av Constitucion 555 Local 1, Pinamar, Buenos Aires</li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Síguenos</h5>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/myriamgomezpropiedades/?hl=es-la" className="text-gray-300 hover:text-pink-500 transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                <FaFacebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>&copy; 2025 Myriam Gómez Propiedades. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
