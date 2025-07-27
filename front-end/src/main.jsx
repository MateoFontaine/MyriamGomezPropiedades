import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import PropiedadDetalle from "./pages/PropiedadDetalle"
import ScrollToTop from "./components/ScrolltoTop"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/propiedad/:id" element={<PropiedadDetalle />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
