import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuessByListening from "./guess_by_listening/GuessByListening";
import GuessByAlbumCover from "./guess_by_album_cover/GuessByAlbumCover";
import Login from "./Login";
import { AuthProvider, useAuth } from "./Auth";
import Home from "./Home"; // Import the Home component

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home accessToken={accessToken} />} />
      <Route path="/guess-by-listening" element={<GuessByListening accessToken={accessToken} />} />
      <Route path="/guess-by-album-cover" element={<GuessByAlbumCover accessToken={accessToken} />} />
    </Routes>
  );
};

export default App;