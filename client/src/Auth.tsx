import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  //localStorage.clear();
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [expiresIn, setExpiresIn] = useState<number | null>(parseInt(localStorage.getItem('expiresIn') || '0'));

  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (code && !accessToken) {
      axios
        .post("http://localhost:2115/login", { code })
        .then(res => {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(Date.now() + res.data.expiresIn * 1000);

          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('expiresIn', (Date.now() + res.data.expiresIn * 1000).toString());

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

          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('expiresIn', (Date.now() + res.data.expiresIn * 1000).toString());
        })
        .catch((error) => {
          console.error("Error during token refresh", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('expiresIn');
          window.location.href = "/";
        });
    }
  }, [code, accessToken, expiresIn, refreshToken]);


  // AUTOMATYCZNE ODŚWIEŻANIE TOKENA CO DANY INTERWAŁ (imo chyba useless ale nie usuwam jakby sie okazalo ze nie) 
  //
  // useEffect(() => {
  //   if (refreshToken && expiresIn) {
  //     const interval = setInterval(() => {
  //       if (Date.now() >= expiresIn - 60 * 1000) {
  //         axios
  //           .post("http://localhost:2115/refresh", { refreshToken })
  //           .then(res => {
  //             setAccessToken(res.data.accessToken);
  //             setExpiresIn(Date.now() + res.data.expiresIn * 1000);

  //             localStorage.setItem('accessToken', res.data.accessToken);
  //             localStorage.setItem('expiresIn', (Date.now() + res.data.expiresIn * 1000).toString());
  //           })
  //           .catch((error) => {
  //             console.error("Error during token refresh", error);
  //             localStorage.removeItem('accessToken');
  //             localStorage.removeItem('refreshToken');
  //             localStorage.removeItem('expiresIn');
  //             window.location.href = "/";
  //           });
  //       }
  //     }, 60 * 1000); // Check every minute

  //     return () => clearInterval(interval);
  //   }
  // }, [refreshToken, expiresIn]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, expiresIn }}>
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
