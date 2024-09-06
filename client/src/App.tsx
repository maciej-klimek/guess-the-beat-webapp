import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuessByListening from "./guess_by_listening/GuessByListening";
import GuessByAlbumCover from "./guess_by_album_cover/GuessByAlbumCover";
import Login from "./auth/Login";
import Loading from "./misc/Loading";
import { AuthProvider, useAuth } from "./auth/Auth";
import Home from "./Home";
import YourTopSongs from "./YourTopSongs";
import Logout from "./auth/Logout";
import Ranking from "./Ranking";
import PlaylistSelectionGBL from "./selection_panels/PlaylistSelectionGBL";
import PlaylistSelectionGBAC from "./selection_panels/PlaylistSelectionGBAC";

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
  const { accessToken, code } = useAuth();

  if (!accessToken && !code) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  } else if (!accessToken) {
    return (
      <Routes>
        <Route path="*" element={<Loading />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home accessToken={accessToken} />} />

      <Route
        path="/guess-by-listening"
        element={<PlaylistSelectionGBL accessToken={accessToken} />}
      />
      <Route
        path="/guess-by-listening/:playlistId"
        element={<GuessByListening accessToken={accessToken} />}
      />

      <Route
        path="/guess-by-album-cover"
        element={<PlaylistSelectionGBAC accessToken={accessToken} />}
      />
      <Route
        path="/guess-by-album-cover/:playlistId"
        element={<GuessByAlbumCover accessToken={accessToken} />}
      />

      <Route
        path="/your-top-songs"
        element={<YourTopSongs accessToken={accessToken} />}
      />
      <Route path="/ranking" element={<Ranking accessToken={accessToken} />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default App;
