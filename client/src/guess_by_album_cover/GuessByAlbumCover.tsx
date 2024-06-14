import React, { useState } from "react";
import { FaHeart } from "react-icons/fa"; // Importuj ikonę serca
import inRainbow from "../../public/by_Inrainbowscover_test.png";

const GuessByAlbumCover: React.FC = () => {
  const [visiblePanels, setVisiblePanels] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const albumName = "123";

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleChange = () => {
    if (inputValue !== albumName) {
      removeBlur();
    } else {
      console.log("nice");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gray1 poppins-semibold">
      <h2 className="text-5xl text-center text-green-500 mt-4 mb-5">
        Guess By Album Cover
      </h2>
      <div className="mt-48 relative flex items-center">
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
      <div className="flex mt-4">
        <input
          className="p-2 rounded-lg mr-1"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          onClick={handleChange}
          className="p-2 bg-blue-500 hover:bg-slate-600 text-white rounded-lg flex items-center"
        >
          Submit
        </button>
      </div>
      <div className="mt-4 flex">
        <FaHeart className="size-10 text-red-600 mr-1" />
        <FaHeart className="size-10 text-red-600 mr-1" />
        <FaHeart className="size-10 text-red-600 mr-1" />
        <FaHeart className="size-10 text-red-600 mr-1" />
        <FaHeart className="size-10 text-red-600 mr-1" />
      </div>
    </div>
  );
};

export default GuessByAlbumCover;
