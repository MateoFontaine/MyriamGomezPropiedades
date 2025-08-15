import { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SERVICIOS = ["Luz","Gas","Agua","WiFi"];
const CARACS    = ["Pileta","Parrilla","Cochera","Jardín","Amoblado","Apto mascotas"];

function FilterSection({ title, open, onToggle, children, count = 0 }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-gray-800">{title}</span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
              {count}
            </span>
          )}
          <svg className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.116l3.71-3.885a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0l-4.24-4.44a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"} overflow-hidden px-4`}>
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
}

export default function Ventas() {
  const [propiedades, setPropiedades] = useState([]);

  const [tiposSel, setTiposSel]   = useState([]); // categoria
  const [ubisSel, setUbisSel]     = useState([]); // ubicacion
  const [servSel, setServSel]     = useState([]); // servicios
  const [caracSel, setCaracSel]   = useState([]); // características

  // acordeones cerrados por defecto
  const [openTipo, setOpenTipo]           = useState(false);
  const [openUbicacion, setOpenUbicacion] = useState(false);
  const [openServicios, setOpenServicios] = useState(false);
  const [openCaracs, setOpenCaracs]       = useState(false);

  useEffect(() => {
    fetch("http://localhost/back-end/get_propiedades.php")
      .then((r) => r.json())
      .then((data) => setPropiedades((data || []).filter((p) => p.tipo === "Venta")))
      .catch((err) => console.error("Error al cargar propiedades", err));
  }, []);

  const opcionesTipo = useMemo(() => {
    return Array.from(new Set(propiedades.map((p) => p.categoria).filter(Boolean)));
  }, [propiedades]);

  const opcionesUbic = useMemo(() => {
    return Array.from(new Set(propiedades.map((p) => p.ubicacion).filter(Boolean)));
  }, [propiedades]);

  const toggle = (val, arr, setter) =>
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const propiedadesFiltradas = useMemo(() => {
    return propiedades.filter((p) => {
      const cat  = p.categoria || "";
      const ubi  = p.ubicacion || "";
      const serv = Array.isArray(p.servicios) ? p.servicios : [];
      const car  = Array.isArray(p.caracteristicas) ? p.caracteristicas : [];

      const matchCat  = tiposSel.length === 0 || tiposSel.includes(cat);
      const matchUbi  = ubisSel.length === 0 || ubisSel.includes(ubi);
      const matchServ = servSel.length === 0 || servSel.every((s) => serv.includes(s));
      const matchCar  = caracSel.length === 0 || caracSel.every((c) => car.includes(c));

      return matchCat && matchUbi && matchServ && matchCar;
    });
  }, [propiedades, tiposSel, ubisSel, servSel, caracSel]);

  const limpiarFiltros = () => {
    setTiposSel([]); setUbisSel([]); setServSel([]); setCaracSel([]);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto py-10 px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Propiedades en Venta</h1>
            {(tiposSel.length || ubisSel.length || servSel.length || caracSel.length) > 0 && (
              <button onClick={limpiarFiltros} className="text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-700">
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtros sticky */}
            <aside className="w-full md:w-1/4 h-fit space-y-4 sticky top-24">
              <FilterSection title="Tipo de Propiedad" open={openTipo} onToggle={() => setOpenTipo((v) => !v)} count={tiposSel.length}>
                <div className="flex flex-col gap-2">
                  {opcionesTipo.map((t) => (
                    <label key={t} className="flex items-center justify-between px-3 py-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{t}</span>
                      <input type="checkbox" className="h-4 w-4 accent-pink-600" checked={tiposSel.includes(t)} onChange={() => toggle(t, tiposSel, setTiposSel)} />
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Ubicación" open={openUbicacion} onToggle={() => setOpenUbicacion((v) => !v)} count={ubisSel.length}>
                <div className="flex flex-col gap-2">
                  {opcionesUbic.map((u) => (
                    <label key={u} className="flex items-center justify-between px-3 py-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{u}</span>
                      <input type="checkbox" className="h-4 w-4 accent-pink-600" checked={ubisSel.includes(u)} onChange={() => toggle(u, ubisSel, setUbisSel)} />
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Servicios" open={openServicios} onToggle={() => setOpenServicios((v) => !v)} count={servSel.length}>
                <div className="flex flex-col gap-2">
                  {SERVICIOS.map((s) => (
                    <label key={s} className="flex items-center justify-between px-3 py-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{s}</span>
                      <input type="checkbox" className="h-4 w-4 accent-pink-600" checked={servSel.includes(s)} onChange={() => toggle(s, servSel, setServSel)} />
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Características" open={openCaracs} onToggle={() => setOpenCaracs((v) => !v)} count={caracSel.length}>
                <div className="flex flex-col gap-2">
                  {CARACS.map((c) => (
                    <label key={c} className="flex items-center justify-between px-3 py-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{c}</span>
                      <input type="checkbox" className="h-4 w-4 accent-pink-600" checked={caracSel.includes(c)} onChange={() => toggle(c, caracSel, setCaracSel)} />
                    </label>
                  ))}
                </div>
              </FilterSection>
            </aside>

            {/* Lista */}
            <section className="flex-1">
              {propiedadesFiltradas.length === 0 ? (
                <div className="text-center text-gray-500 py-20 border border-dashed rounded-xl">
                  No encontramos resultados con esos filtros.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propiedadesFiltradas.map((p) => (
                    <PropertyCard
                      key={p.id}
                      id={p.id}
                      image={p.imagen}
                      price={p.precio}
                      title={`${p.titulo}${p.cod ? ` • COD ${p.cod}` : ""}`}
                      address={p.ubicacion}
                      bedrooms={p.dormitorios}
                      bathrooms={p.baños}
                      size={p.superficie}
                      type={p.tipo}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
