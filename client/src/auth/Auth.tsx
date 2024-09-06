import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  code: string | null;
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

  // Handle login and set tokens
  useEffect(() => {
    if (code && !accessToken) {
      axios
        .post("http://localhost:2115/login", { code })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(Date.now() + res.data.expiresIn * 1000);
          window.history.pushState({}, "", "/");
        })
        .catch((error) => {
          console.error("Error during login request", error);
          window.location.href = "/";
        });
    }
  }, [code, accessToken]);

  // Refresh token every 30 seconds for testing
  useEffect(() => {
    if (accessToken && refreshToken) {
      const refreshInterval = setInterval(() => {
        console.log("Refreshing token");
        axios
          .post("http://localhost:2115/refresh", { refreshToken })
          .then((res) => {
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
      }, 3599999); // refresh time

      return () => clearInterval(refreshInterval); // Clean up the interval on component unmount
    }
  }, [accessToken, refreshToken]);

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, expiresIn, code, logout }}
    >
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
