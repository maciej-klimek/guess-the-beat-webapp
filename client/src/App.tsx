import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuessByListening from "./guess_by_listening/GuessByListening";
import GuessByAlbumCover from "./guess_by_album_cover/GuessByAlbumCover";
import Login from "./auth/Login";
import { AuthProvider, useAuth } from "./auth/Auth";
import Home from "./Home";
import YourTopSongs from "./misc/YourTopSongs";
import Logout from "./auth/Logout";

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
      <Route path="/your-top-songs" element={<YourTopSongs accessToken={accessToken} />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default App;
