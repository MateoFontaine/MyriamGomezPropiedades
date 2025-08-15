// src/components/AuthGuard.jsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function AuthGuard({ children, requiredRole = "admin" }) {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userRole = localStorage.getItem("userRole")

    if (!isAuthenticated || userRole !== requiredRole) {
      navigate("/login")
    }
  }, [navigate, requiredRole])

  return children
}
