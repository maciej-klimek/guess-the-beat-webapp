// App.tsx
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
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/guess-by-listening" element={<GuessByListening />} />
          <Route path="/guess-by-album-cover" element={<GuessByAlbumCover />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { accessToken } = useAuth();

  return accessToken ? <Home accessToken={accessToken} /> : <Login />;
};

export default App;
