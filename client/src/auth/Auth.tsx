// Auth.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (code && !accessToken) {
      axios
        .post("http://13.60.167.48/login", { code })
        .then(res => {
          setAccessToken(res.data.accessToken);
          console.log(res.data.accessToken)
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(Date.now() + res.data.expiresIn * 1000);

          window.history.pushState({}, "", "/");
        })
        .catch((error) => {
          console.error("Error during login request", error);
          window.location.href = "/";
        });
    } else if (accessToken && refreshToken && Date.now() >= expiresIn!) {
      axios
        .post("http://localhost:2115/refresh", { refreshToken })
        .then(res => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(Date.now() + res.data.expiresIn * 1000);
        })
        .catch((error) => {
          console.error("Error during token refresh", error);
          setAccessToken(null);
          setRefreshToken(null);
          setExpiresIn(null);
          window.location.href = "/";
        });
    }
  }, [code, accessToken, expiresIn, refreshToken]);

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, expiresIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
