import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import PropiedadDetalle from "./pages/PropiedadDetalle"
import ScrollToTop from "./components/ScrolltoTop"
import Ventas from "./pages/Ventas";
import Alquiler from "./pages/Alquiler"
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login"
import { AuthGuard } from "./components/AuthGuard"
import TestUpload from "./pages/TestUpload";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/propiedad/:id" element={<PropiedadDetalle />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/alquiler" element={<Alquiler />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test-upload" element={<TestUpload />} />

        <Route
          path="/admin-myriam-panel-78yNhd"
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
