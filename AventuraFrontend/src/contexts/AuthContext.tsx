import { createContext, useContext, useState, useEffect, } from "react";
import type { ReactNode } from "react";
import type { UserDto } from "../models/auth/UserDto";
import type { AuthContextType } from "@/models/auth/AuthContextType";
import type { AuthResponse } from "@/models/auth/AuthResponse";

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);
  
  const login = async (
    request: AuthResponse
  ) => {
    localStorage.setItem("authToken", request.token);
    localStorage.setItem("user", JSON.stringify(request.user));

    setToken(request.token);
    setUser(request.user!);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};