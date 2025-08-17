export async function uploadToCloudinary(file) {
  const cloud = import.meta.env.VITE_CLOUDINARY_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "inmobiliaria/propiedades");

  const res = await fetch(url, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Error subiendo imagen");

  return data.secure_url; // URL de la imagen en Cloudinary
}
