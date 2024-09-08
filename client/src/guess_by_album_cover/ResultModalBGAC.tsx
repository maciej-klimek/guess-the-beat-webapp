import React from "react";

interface Album {
  id: string;
  images: { url: string }[];
  release_date: string;
  name: string;
  artists: { name: string }[];
  genres: string[];
}

interface ResultModalProps {
  isCorrectGuess: boolean;
  track: Album;
  handleNextTrack: () => void;
  avaliablePoints: number;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isCorrectGuess,
  track,
  handleNextTrack,
  avaliablePoints,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white py-10 px-20 rounded-xl text-center">
        {isCorrectGuess ? (
          <div>
            <h3 className="text-3xl mb-1">Correct! 🎉🔥</h3>
            <h1 className="text-base mb-8 text-neutral-700">
              You gained {avaliablePoints} points!
            </h1>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl text-red-500 mb-1">Out of Chances! 😩</h3>
            <h1 className="text-base mb-8 text-neutral-700">
              You lost 50 points{" "}
            </h1>
          </div>
        )}

        <img
          src={track.images[0].url}
          alt={track.name}
          className="w-48 h-48 mx-auto mb-4 rounded-xl"
        />
        <p className="text-lg font-semibold text-gray-800">{track.name}</p>
        <p className="text-md text-gray-600">
          by {track.artists.map((artist) => artist.name).join(", ")}
        </p>
        <button
          onClick={handleNextTrack}
          className={`mt-4 px-4 py-2 ${
            isCorrectGuess ? "bg-green-500" : "bg-red-500"
          } text-white rounded-md shadow-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
        >
          Next Album
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
