import React, { useState } from "react";
import inRainbow from "../../public/by_Inrainbowscover_test.png";

const GuessByAlbumCover: React.FC = () => {
  const [visiblePanels, setVisiblePanels] = useState<number[]>([]);

  const removeBlur = () => {
    const availableIndexes = Array.from(
      { length: 9 },
      (_, index) => index
    ).filter((index) => !visiblePanels.includes(index));

    if (availableIndexes.length === 0) {
      setVisiblePanels([]);
      return;
    }

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    setVisiblePanels([...visiblePanels, randomIndex]);
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray-900 poppins-semibold">
      <h2 className="text-5xl text-center text-green-500 mt-4 mb-5">
        Guess By Album Cover
      </h2>
      <div className="relative flex items-center h-full">
        <img
          className="mx-auto border rounded p-2 w-80 h-80"
          src={inRainbow}
          alt="Album Cover"
        />
        <div className="absolute grid grid-cols-3 grid-rows-3 w-80 h-80">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className={`w-full h-full ${
                visiblePanels.includes(index)
                  ? "bg-transparent"
                  : "backdrop-filter backdrop-blur-md"
              }`}
            />
          ))}
        </div>
      </div>
      <button
        onClick={removeBlur}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Remove Blur
      </button>
    </div>
  );
};

export default GuessByAlbumCover;
