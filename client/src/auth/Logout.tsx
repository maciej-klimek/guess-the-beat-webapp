import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null;
};

export default Logout;
