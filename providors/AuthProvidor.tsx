"use client";

import { createContext, useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  phone: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // فقط در سمت کلاینت اجرا می‌شود
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        setAccessToken(token);
        setRefreshToken(localStorage.getItem("refresh_token"));
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}