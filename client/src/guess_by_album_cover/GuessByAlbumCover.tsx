import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AlbumCover from "./AlbumCover";
import GuessInput from "./GuessInput";
import Hearts from "./Hearts";
import useFetchAlbumsName from "./useFetchAlbumsName";
import useFetchLikedAlbums from "./useFetchLikedAlbums";

interface GuessByAlbumCoverProps {
  accessToken: string;
}

interface Album {
  album: {
    id: string;
    images: { url: string }[];
    release_date: string;
    name: string;
    artists: { name: string }[];
    genres: string[];
  };
}

const GuessByAlbumCover: React.FC<GuessByAlbumCoverProps> = ({
  accessToken,
}) => {
  const [visiblePanels, setVisiblePanels] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [likedAlbums, setLikedAlbums] = useState<Album[]>([]);
  const [guessedAlbum, setGuessedAlbum] = useState<Album | null>(null);
  const [emptyHeartsCount, setEmptyHeartsCount] = useState(0);
  const [heartsCount, setHeartsCount] = useState(5);
  const [albumSuggestions, setAlbumSuggestions] = useState<Album[]>([]);
  const [pickedAlbum, setPickedAlbum] = useState(0);
  const [pointCounter, setPointCounter] = useState(100);

  useFetchAlbumsName(inputValue, accessToken, setAlbumSuggestions);

  useFetchLikedAlbums(accessToken, setLikedAlbums);

  useEffect(() => {
    const resetGame = () => {
      setVisiblePanels([]);
      setInputValue("");
      setGuessedAlbum(null);
      setEmptyHeartsCount(0);
      setHeartsCount(5);
      setPointCounter(100);
    };

    resetGame();
  }, []);

  const removeBlur = () => {
    const availableIndexes = Array.from(
      { length: 9 },
      (_, index) => index
    ).filter((index) => !visiblePanels.includes(index));

    if (availableIndexes.length > 0) {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      setVisiblePanels([...visiblePanels, randomIndex]);
      setEmptyHeartsCount(emptyHeartsCount + 1);
      setPickedAlbum(0);
      setHeartsCount(heartsCount - 1);
      setPointCounter(pointCounter - 20);
      if (emptyHeartsCount === 4) {
        removeAllBlur();
        setPickedAlbum(0);
        setInputValue("");
        setPointCounter(pointCounter - 20);
        alert("Niestety przegrałeś, spróbuj ponownie");
      }
    }
  };

  const removeAllBlur = () => {
    const allIndexes = Array.from({ length: 9 }, (_, index) => index);
    setVisiblePanels(allIndexes);
    setPickedAlbum(0);
    setInputValue("");
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleChange = () => {
    if (inputValue.toLowerCase() !== guessedAlbum?.album.name.toLowerCase()) {
      removeBlur();
      setInputValue("");
    } else {
      removeAllBlur();
      alert("Gratulacje, udało Ci się odgadnąć nazwę!");
    }
  };

  const handleAlbumSelection = (selectedAlbum: Album) => {
    setInputValue(selectedAlbum.album.name);
    setPickedAlbum(1);
    setAlbumSuggestions([]);
  };

  const handleGuess = () => {
    setGuessedAlbum(likedAlbums[getRandomInt(0, likedAlbums.length - 1)]);
    setVisiblePanels([]);
    setPointCounter(100);
    setEmptyHeartsCount(0);
    setHeartsCount(5);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4 relative">
      <div className="absolute top-6 right-4">
        <Link to="/" className="text-white bg-gray2 p-2 rounded">
          Home
        </Link>
      </div>
      <h2 className="text-5xl text-center text-green-500">
        Guess By Album Cover
      </h2>
      <button
        onClick={handleGuess}
        className="mt-10 px-20 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        ZGADUJ!
      </button>
      {guessedAlbum && (
        <div className="mt-2 text-2xl text-green-500">
          Points: {pointCounter}
        </div>
      )}
      {guessedAlbum && (
        <AlbumCover
          imageUrl={guessedAlbum.album.images[0].url}
          visiblePanels={visiblePanels}
        />
      )}
      {guessedAlbum && (
        <GuessInput
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleChange}
          albumSuggestions={albumSuggestions}
          onSelectAlbum={handleAlbumSelection}
          pickedAlbum={pickedAlbum}
        />
      )}
      {guessedAlbum && (
        <Hearts emptyHeartsCount={emptyHeartsCount} heartsCount={heartsCount} />
      )}
      {guessedAlbum && (
        <div className="text-sm break-words w-full text-gray-800 mt-4">
          Album Title: {guessedAlbum.album.name}
        </div>
      )}
    </div>
  );
};

export default GuessByAlbumCover;
