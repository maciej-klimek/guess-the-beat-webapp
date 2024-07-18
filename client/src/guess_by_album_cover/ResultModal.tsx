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
}

const ResultModal: React.FC<ResultModalProps> = ({
  isCorrectGuess,
  track,
  handleNextTrack,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg text-center">
        {isCorrectGuess ? (
          <h3 className="text-2xl mb-4">Correct! 🎉🔥</h3>
        ) : (
          <h3 className="text-2xl mb-4 text-red-500">Out of Chances! 😩</h3>
        )}

        <img
          src={track.images[0].url}
          alt={track.name}
          className="w-32 h-32 mx-auto mb-4 rounded-xl"
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
          Next Track
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
