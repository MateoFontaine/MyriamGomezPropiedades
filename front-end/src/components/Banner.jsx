function Banner() {
  return (
    
    <div className="relative w-full h-[900px] overflow-hidden ">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/VideoPinamar.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

       <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40 backdrop-blur-sm px-4">
        <h2 className="text-white text-3xl sm:text-4xl font-semibold mb-6 text-center">
          Encontrá tu próxima propiedad
        </h2>

        <form className="bg-white/20 backdrop-blur-lg p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
          <select className="p-2 rounded-md bg-white text-sm">
            <option>Tipo de Propiedad</option>
            <option>Casa</option>
            <option>Departamento</option>
          </select>
          <select className="p-2 rounded-md bg-white text-sm">
            <option>Dormitorios</option>
            <option>1</option>
            <option>2</option>
            <option>3+</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por ubicación o código"
            className="p-2 rounded-md bg-white text-sm"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md font-semibold transition"
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Banner;