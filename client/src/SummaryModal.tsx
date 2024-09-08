import React from "react";
import { useNavigate } from "react-router-dom";

interface SummaryModalProps {
  finalScore: number;
  guessQueue: {
    name: string | null;
    artists: { name: string }[];
    album?: { images: { url: string }[] }; // Make album optional for GBL
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
    <div className="fixed flex items-center justify-center bg-neutral-100 rounded-xl">
      <div className="py-10 px-16 rounded-xl flex justify-between items-center text-center">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center items-center pr-4">
          <div className="text-3xl text-neutral-700 mb-2">You scored</div>
          <div className="text-4xl mb-2">{finalScore} Points</div>
          <div className="text-3xl text-neutral-700">in total</div>

          {/* Play Again button */}
          <button
            onClick={handleNewGame}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-md"
          >
            Play Again? 🎮
          </button>

          {/* Main Menu button */}
          <button
            onClick={handleMenuExit}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-md"
          >
            Main Menu 🏠
          </button>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col justify-stretch items-start pl-4 ">
          {/* Display guessed tracks or albums depending on the mode */}
          <div className="bg-gray-2 p-4 rounded-xl w-full">
            <h3 className="text-xl font-semibold mb-2 text-neutral-700">
              {mode === "BGAC" ? "Albums Guessed:" : "Tracks Guessed:"}
            </h3>
            <ul className="list-none p-2 overflow-y-auto bg-gray-1 rounded-xl">
              {guessQueue.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start p-2 cursor-pointer hover:bg-blue-300 rounded-xl"
                >
                  {/* Check for images and album presence */}
                  {item.album &&
                    item.album.images &&
                    item.album.images[0]?.url && (
                      <img
                        src={item.album.images[0].url}
                        alt={item.name ?? ""}
                        className="w-16 h-16 inline-block mr-4"
                      />
                    )}
                  {item.images && (
                    <img
                      src={item.images[0].url}
                      alt={item.name ?? ""}
                      className="w-16 h-16 inline-block mr-4"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-sm text-neutral-500">
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
