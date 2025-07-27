const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Datos de ejemplo (simula una base de datos)
const propiedades = [
  {
    id: 1,
    titulo: "Departamento moderno en Palermo",
    ubicacion: "Palermo, CABA",
    precio: 85000,
    imagen: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    dormitorios: 2,
    baños: 1,
    superficie: 55,
    tipo: "Venta",
    descripcion: "Luminoso departamento con balcón y cocina integrada.",
  },
  {
    id: 2,
    titulo: "Casa con jardín en Pinamar",
    ubicacion: "Pinamar, Buenos Aires",
    precio: 210000,
    imagen: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    dormitorios: 4,
    baños: 2,
    superficie: 140,
    tipo: "Venta",
    descripcion: "Casa amplia con gran jardín y parrilla, ideal para familia.",
  },
  {
    id: 3,
    titulo: "Monoambiente en San Telmo",
    ubicacion: "San Telmo, CABA",
    precio: 59000,
    imagen: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    dormitorios: 1,
    baños: 1,
    superficie: 30,
    tipo: "Alquiler",
    descripcion: "Monoambiente ideal para estudiante o profesional.",
  },
  {
    id: 4,
    titulo: "Loft moderno en Recoleta",
    ubicacion: "Recoleta, CABA",
    precio: 98000,
    imagen: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80",
    dormitorios: 1,
    baños: 1,
    superficie: 45,
    tipo: "Venta",
    descripcion: "Loft renovado con cocina americana y vista abierta.",
  }
];

// Ruta de prueba
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend" });
});

// Obtener todas las propiedades
app.get("/api/propiedades", (req, res) => {
  res.json(propiedades);
});

// Obtener una propiedad por ID
app.get("/api/propiedades/:id", (req, res) => {
  const propiedad = propiedades.find((p) => p.id === parseInt(req.params.id));
  if (propiedad) {
    res.json(propiedad);
  } else {
    res.status(404).json({ error: "Propiedad no encontrada" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
