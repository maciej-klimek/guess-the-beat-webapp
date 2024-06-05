import React from "react"
import "./App.css"
import ByListeningPanel from "./choose_panels/ByListeningPanel"
import ByAlbumCoverPanel from "./choose_panels/ByAlbumCoverPanel"

const App: React.FC = () => {
  return (
    <div className="h-screen text-green-500 text-center bg-gray1 poppins-semibold">
      <h1 className="text-5xl pt-40">
        Guess the beat!
      </h1>
      <div className="flex justify-center w-screen mt-20">
        <div className="flex w-3/4 mt-20">
          <div className="flex-1 mr-32">
            <ByListeningPanel />
          </div>
          <div className="flex-1 ml-32">
            <ByAlbumCoverPanel />
          </div>
        </div>
      </div>
    </div>
  );
};



export default App
