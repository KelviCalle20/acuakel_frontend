// src/commmon/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles?: string[]; // roles permitidos, opcional
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // esto puede ser un string o JSON dependiendo de cómo guardes

  if (!token) {
    // no está logueado
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole) {
    // validamos roles
    const rolesArray = JSON.parse(userRole); // si guardaste como JSON array de strings
    const hasAccess = rolesArray.some((role: string) => allowedRoles.includes(role));
    if (!hasAccess) {
      return <Navigate to="/" replace />; // redirige si no tiene permiso
    }
  }

  return children;
};

export default ProtectedRoute;

