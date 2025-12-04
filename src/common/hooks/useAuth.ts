import { useState, useEffect } from "react";

export const useAuth = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRoles");
    const storedToken = localStorage.getItem("token");

    if (storedRoles) setRoles(JSON.parse(storedRoles));
    if (storedToken) setToken(storedToken);
  }, []);

  const hasRole = (requiredRoles: string[] | string) => {
    if (!roles || roles.length === 0) return false;
    if (typeof requiredRoles === "string") {
      return roles.includes(requiredRoles);
    }
    return requiredRoles.some(role => roles.includes(role));
  };

  return { roles, token, hasRole };
};
