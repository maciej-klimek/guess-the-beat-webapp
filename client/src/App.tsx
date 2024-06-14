import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ByListeningPanel from "./home_page_selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./home_page_selection_panels/ByAlbumCoverPanel";
import GuessByListening from "./guess_by_listening/GuessByListening"
import GuessByAlbumCover from "./guess_by_album_cover/GuessByAlbumCover";

const App: React.FC = () => {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guess-by-listening" element={<GuessByListening />} />
        <Route path="/guess-by-album-cover" element={<GuessByAlbumCover />} />
      </Routes>
    </Router>
  );
};


const Home: React.FC = () => (
  <div className="h-screen text-green-500 text-center bg-gray1 poppins-semibold">

    <h1 className="text-5xl pt-40">
      Guess the beat!
    </h1>
    <div className="flex justify-center w-screen mt-20">
      <div className="flex w-3/4 mt-20">
        <div className="flex-1 mr-32">
          <Link to="/guess-by-listening">
            <ByListeningPanel />
          </Link>
        </div>
        <div className="flex-1 ml-32">
          <Link to="/guess-by-album-cover">
            <ByAlbumCoverPanel />
          </Link>
        </div>
      </div>
    </div>
  </div>

);

export default App;

