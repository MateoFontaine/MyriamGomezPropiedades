import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import logo from "../assets/logo.png"

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Venta", href: "/venta" },
    { label: "Alquiler", href: "/alquiler" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isDesktop = window.innerWidth >= 768 // Tailwind md breakpoint

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDesktop
          ? scrolled
            ? "bg-white shadow-md"
            : "bg-transparent"
          : "bg-white shadow-md"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-14 mr-2" />
          <span
            className={`text-xl font-semibold ${
              isDesktop && !scrolled ? "text-white" : "text-[#ed327d]"
            }`}
          >
            Myriam Gómez Propiedades
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                isDesktop && !scrolled
                  ? "text-white hover:text-[#ed327d]"
                  : "text-gray-700 hover:text-[#ed327d]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className={`md:hidden transition-colors ${
            isDesktop && !scrolled ? "text-white" : "text-gray-700"
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
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#ed327d] font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
