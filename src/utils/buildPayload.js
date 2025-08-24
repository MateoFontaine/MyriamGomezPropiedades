export function buildPayload({
  titulo, ubicacion, precio, tipo, categoria,
  dormitorios, banios, superficie, imagen, imagenes,
  descripcion, oportunidad, servicios, caracteristicas,
}) {
  const main = imagen || (imagenes?.[0] ?? "");
  const orderedImgs = main ? [main, ...(imagenes || []).filter(u => u !== main)] : (imagenes || []);
  return {
    titulo,
    ubicacion,
    precio: String(precio ?? ""), // el back lo espera string
    tipo,
    categoria,
    dormitorios: Number(dormitorios || 0),
    "baños": Number(banios || 0),
    superficie: String(superficie || ""),
    imagen: orderedImgs[0] || "",
    imagenes: orderedImgs,
    descripcion: descripcion || "",
    oportunidad: oportunidad ? 1 : 0,
    servicios: servicios || [],
    caracteristicas: caracteristicas || [],
  };
}
