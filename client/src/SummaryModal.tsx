import React from "react";
import { useNavigate } from "react-router-dom";

interface SummaryModalProps {
  finalScore: number;
  guessQueue: {
    name: string;
    artists: { name: string }[];
    album?: { images: { url: string }[] }; // Make album optional for GBL
    images?: { url: string }[]
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg text-center">
        <div>
          <span>Your final score: {finalScore}</span>
        </div>

        {/* Display guessed tracks or albums depending on the mode */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            {mode === "BGAC" ? "Albums Guessed:" : "Tracks Guessed:"}
          </h3>
          <ul className="list-disc list-inside">
            {guessQueue.map((item, index) => (
              <li key={index} className="text-left mb-4">
                {/* Check for images and album presence */}
                {item.album &&
                  item.album.images &&
                  item.album.images[0]?.url && (
                    <img
                      src={item.album.images[0].url}
                      alt={item.name}
                      className="w-16 h-16 inline-block mr-4"
                    />
                  )}
                {item.images && (
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className="w-16 h-16 inline-block mr-4"
                    />)}
                {item.name} -{" "}
                {item.artists.map((artist) => artist.name).join(", ")}
              </li>
            ))}
          </ul>
        </div>

        {/* Play Again button */}
        <button
          onClick={handleNewGame}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-md"
        >
          Play Again?
        </button>

        {/* Main Menu button */}
        <button
          onClick={handleMenuExit}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-md"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
