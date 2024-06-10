import React, { useState } from "react";
//import inBlur from "../../public/by_Blur_test.jpg";
import inRainbow from "../../public/by_Inrainbowscover_test.png";

const GuessByAlbumCover: React.FC = () => {
  const [blurredPanels, setBlurredPanels] = useState<number[]>([]);

  const toggleBlur = () => {
    const newBlurredPanels = [...blurredPanels];

    const availableIndexes = Array.from(
      { length: 9 },
      (_, index) => index
    ).filter((index) => !newBlurredPanels.includes(index));

    if (availableIndexes.length === 0) {
      setBlurredPanels([]);
      return;
    }

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    newBlurredPanels.push(randomIndex);
    setBlurredPanels(newBlurredPanels);
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray-900 poppins-semibold">
      <h2 className="text-5xl text-center text-green-500 align-top mt-4 mb-5">
        Guess By Album Cover
      </h2>
      <div className="relative flex items-center h-full">
        <img
          className="mx-auto border rounded p-2 justify-center w-80 h-80"
          src={inRainbow}
          alt="Blur Test"
        ></img>
        <div className="grid absolute grid-cols-3 grid-rows-3 w-80 h-80">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={`bg-transparent w-full h-full ${
                blurredPanels.includes(index)
                  ? ""
                  : "backdrop-filter backdrop-blur-md"
              }`}
            ></div>
          ))}
        </div>
      </div>
      <button
        onClick={toggleBlur}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Toggle Blur
      </button>
    </div>
  );
};

export default GuessByAlbumCover;
