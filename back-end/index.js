const express = require("express")
const cors = require("cors")

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend" })
})

app.get("/api/propiedades", (req, res) => {
  const propiedades = [
    {
      id: 1,
      titulo: "Departamento 2 ambientes",
      ubicacion: "Palermo, CABA",
      precio: 85000,
      imagen: "https://via.placeholder.com/300x200?text=Propiedad+1"
    },
    {
      id: 2,
      titulo: "Casa 4 ambientes con jardín",
      ubicacion: "Pinamar, Buenos Aires",
      precio: 210000,
      imagen: "https://via.placeholder.com/300x200?text=Propiedad+2"
    }
  ];

  res.json(propiedades);
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
