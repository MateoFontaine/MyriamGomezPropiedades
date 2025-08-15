import { MapPin, Phone, Mail } from "lucide-react";

const Contacto = () => {
  return (
    <section id="contacto" className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 scroll-mt-40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Columna izquierda: contacto + mapa */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-pink-600">Contacto</h2>
          <p className="text-gray-600">Estamos para ayudarte. Escribinos o acercate a nuestra oficina.</p>

          <div className="space-y-3 text-gray-700 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-pink-600" /> +54 11 5459-1954
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-pink-600" /> myriamgomezpropiedades@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-600" /> Av Constitucion 555 Local 1, Pinamar, Buenos Aires
            </p>
          </div>

          {/* Mapa */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              title="Ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3181.701183573002!2d-56.864608641565006!3d-37.11222995398453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959c9ce859243a97%3A0x8723f48ddf44e31!2sAv.%20Constituci%C3%B3n%20555%2C%20B7167%20Pinamar%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1753652682994!5m2!1sen!2sar"
              width="100%"
              height="220"
              allowFullScreen=""
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>

        {/* Columna derecha: formulario */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 font-medium">Nombre</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium">Teléfono</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium">Mensaje</label>
            <textarea
              rows="4"
              required
              className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacto;
