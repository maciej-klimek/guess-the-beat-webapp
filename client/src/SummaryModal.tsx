import React from "react";
import { useNavigate } from "react-router-dom";

interface SummaryModalProps {
  finalScore: number;
  guessQueue: {
    name: string | null;
    artists: { name: string }[];
    album?: { images: { url: string }[] };
    images?: { url: string }[];
  }[];
  mode: "GBL" | "BGAC"; // Mode variable to differentiate between GuessByListening and GuessByAlbumCover
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  finalScore,
  guessQueue,
  mode,
}) => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    if (mode === "BGAC") {
      navigate("/guess-by-album-cover");
    } else if (mode === "GBL") {
      navigate("/guess-by-listening");
    }
  };

  const handleMenuExit = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-neutral-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex w-full max-w-4xl">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center bg-gray-100 p-6 w-1/2 rounded-xl mr-8">
          <div className="text-3xl text-gray-700 mb-2">You scored</div>
          <div
            className={`text-4xl mb-2 ${
              finalScore < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {finalScore} Points
          </div>
          <div className="text-3xl text-gray-700">in total</div>

          {/* Play Again and Main Menu buttons */}
          <div className="flex space-x-4 mt-16">
            <button
              onClick={handleNewGame}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md transform transition-transform duration-100 hover:scale-105"
            >
              Play Again 🎵
            </button>

            <button
              onClick={handleMenuExit}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md transform transition-transform duration-100 hover:scale-105"
            >
              Main Menu 🏠
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-gray-100 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold text-neutral-700 mb-4">
            {mode === "BGAC" ? "Albums list:" : "Tracks list:"}
          </h3>
          <div className="h-80 overflow-y-auto">
            <ul className="list-none p-0 m-0">
              {guessQueue.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-4 mb-2 bg-white rounded-lg shadow-sm"
                >
                  {/* Check for images and album presence */}
                  {item.album &&
                    item.album.images &&
                    item.album.images[0]?.url && (
                      <img
                        src={item.album.images[0].url}
                        alt={item.name ?? ""}
                        className="w-16 h-16 mr-4 rounded-md"
                      />
                    )}
                  {item.images && (
                    <img
                      src={item.images[0].url}
                      alt={item.name ?? ""}
                      className="w-16 h-16 mr-4"
                    />
                  )}
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.artists.map((artist) => artist.name).join(", ")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
