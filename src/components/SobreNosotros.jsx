import { Handshake, HeartHandshake } from "lucide-react";

const SobreNosotros = () => {
  return (
    <section id="nosotros" className="bg-white py-16 px-4 sm:px-6 lg:px-8 scroll-mt-40">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Sobre Nosotros
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          En <span className="text-pink-600 font-semibold">Myriam Gómez Propiedades</span> trabajamos con pasión hace más de 10 años, ayudando a las personas a encontrar el hogar ideal. Brindamos un servicio humano, transparente y profesional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card Misión */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition text-left border">
            <div className="flex items-center mb-4 text-pink-600">
              <Handshake className="w-8 h-8" />
              <h3 className="ml-3 text-xl font-semibold text-gray-800">Nuestra Misión</h3>
            </div>
            <p className="text-gray-600">
              Acompañarte en todo el proceso de compra, venta o alquiler con compromiso y calidez.
            </p>
          </div>

          {/* Card Valores */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition text-left border">
            <div className="flex items-center mb-4 text-pink-600">
              <HeartHandshake className="w-8 h-8" />
              <h3 className="ml-3 text-xl font-semibold text-gray-800">Nuestros Valores</h3>
            </div>
            <p className="text-gray-600">
              Honestidad, confianza y dedicación. Porque no solo vendemos propiedades: construimos relaciones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
