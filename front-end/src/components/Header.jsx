import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isInicio = location.pathname === "/";
  const isDesktop = window.innerWidth >= 768;
  const isFixedWhite = !isInicio || (isDesktop ? scrolled : true);

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Venta", href: "/ventas" },
    { label: "Alquiler", href: "/alquiler" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (anchor) => {
    if (location.pathname !== "/") {
      navigate(`/#${anchor}`);
      setTimeout(() => {
        const section = document.getElementById(anchor);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(anchor);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isFixedWhite ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <a href="/">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-14 mr-2" />
            <span
              className={`hidden md:inline text-xl font-semibold ${
                isFixedWhite ? "text-[#ed327d]" : "text-white"
              }`}
            >
              Myriam Gómez Propiedades
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <button
                key={link.href}
                onClick={() => handleAnchorClick(link.href.replace("/#", ""))}
                className={`font-medium transition-colors ${
                  isFixedWhite
                    ? "text-gray-700 hover:text-[#ed327d]"
                    : "text-white hover:text-[#ed327d]"
                }`}
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isFixedWhite
                    ? "text-gray-700 hover:text-[#ed327d]"
                    : "text-white hover:text-[#ed327d]"
                }`}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className={`md:hidden transition-colors ${
            isFixedWhite ? "text-gray-700" : "text-white"
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 bg-white">
          <nav className="flex flex-col space-y-2">
            {links.map((link) =>
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => handleAnchorClick(link.href.replace("/#", ""))}
                  className="text-gray-700 hover:text-[#ed327d] font-medium text-left"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-gray-700 hover:text-[#ed327d] font-medium"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
