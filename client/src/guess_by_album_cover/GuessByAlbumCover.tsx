import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlbumCover from "./AlbumCover";
import GuessInput from "./GuessInput";
import Hearts from "./Hearts";
import GuessButton from "./GuessButton";
import ResultModal from "./ResultModal";
import { FaArrowLeft } from "react-icons/fa";
import UserDataManager from "../UserDataManager";

interface GuessByAlbumCoverProps {
  accessToken: string;
}

interface Album {
  id: string;
  images: { url: string }[];
  release_date: string;
  name: string;
  artists: { name: string }[];
  genres: string[];
}

const GuessByAlbumCover: React.FC<GuessByAlbumCoverProps> = ({
  accessToken,
}) => {
  const location = useLocation();
  const albums: Album[] = location.state?.tracks || [];
  const playlistName: string | undefined = location.state?.playlistName;
  const [visiblePanels, setVisiblePanels] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [guessedAlbum, setGuessedAlbum] = useState<Album | null>(null);
  const [emptyHeartsCount, setEmptyHeartsCount] = useState(0);
  const [albumSuggestions, setAlbumSuggestions] = useState<Album[]>([]);
  const [pickedAlbum, setPickedAlbum] = useState(0);
  const [pointCounter, setPointCounter] = useState(100);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [userData, setUserData] = useState<any>(null); // State to store user data

  //console.log(albums);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        const userData = await UserDataManager.fetchUserData(accessToken);
        setUserData(userData);
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    const fetchAlbumSuggestions = async () => {
      if (!inputValue) {
        setAlbumSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${inputValue}&type=album`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const albums = response.data.albums.items.map((album: Album) => ({
          id: album.id,
          images: album.images,
          release_date: album.release_date,
          name: album.name,
          artists: album.artists,
          genres: album.genres,
        }));
        setAlbumSuggestions(albums);
      } catch (error) {
        console.error("Error fetching album suggestions:", error);
        setAlbumSuggestions([]);
      }
    };
    fetchAlbumSuggestions();
  }, [inputValue, accessToken]);

  const handlePlayGame = () => {
    resetGame();
    if (albums.length > 0) {
      const randomIndex = getRandomInt(0, albums.length);
      const selectedAlbum = albums[randomIndex];
      setGuessedAlbum(selectedAlbum);
      albums.splice(randomIndex, 1);
    } else {
      console.warn("No albums found in the selected playlist");
    }
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const resetGame = () => {
    setVisiblePanels([]);
    setInputValue("");
    setGuessedAlbum(null);
    setEmptyHeartsCount(0);
    setPointCounter(100);
    setShowResult(false);
    setIsCorrectGuess(false);
  };

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
      setPointCounter(pointCounter - 20);
      if (emptyHeartsCount === 4) {
        removeAllBlur();
        setPickedAlbum(0);
        setInputValue("");
        setPointCounter(pointCounter - 20);
        setIsCorrectGuess(false);
        setShowResult(true);
      }
    }
  };

  const removeAllBlur = () => {
    const allIndexes = Array.from({ length: 9 }, (_, index) => index);
    setVisiblePanels(allIndexes);
    setPickedAlbum(0);
    setInputValue("");
  };

  const handleAlbumSelection = (selectedAlbum: Album) => {
    setInputValue(selectedAlbum.name);
    setPickedAlbum(0);
    setAlbumSuggestions([]);
  };

  const handleCheckAnswear = async () => {
    if (inputValue.toLowerCase() !== guessedAlbum?.name.toLowerCase()) {
      removeBlur();
      setInputValue("");
    } else {
      removeAllBlur();
      setIsCorrectGuess(true);
      setShowResult(true);
      const newScore = (userData.score ?? 0) + 100;
      //console.log("Trying to update score")
      await UserDataManager.updateUserScore(userData.id, userData.display_name, newScore);
      //console.log("Recevied confirmation")
      setUserData({ ...userData, score: newScore }); // Update local user state
      //console.log("Updated Score")
    }
  };

  const handleNextTrack = () => {
    setShowResult(false);
    handlePlayGame();
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4 relative">
    <div className="absolute top-8 left-8">
        <Link
            to="/"
            className="flex items-center justify-center text-white bg-gray2 w-12 h-12 rounded-full hover:bg-neutral-800" // Circular button with center-aligned icon
        >
            <FaArrowLeft className="text-xl" />
        </Link>
      </div>
      <h2 className="text-4xl md:text-5xl mt-8">
        Guess By Album Cover 💽 <br />
        {playlistName && (
          <span className="text-lg text-gray-700">from {playlistName}</span>
        )}
      </h2>
      {!guessedAlbum && <GuessButton onStartGame={handlePlayGame} />}
      {guessedAlbum && (
        <div className="mt-4 text-2xl text-green-500">
          Points: {pointCounter}
        </div>
      )}
      {guessedAlbum && (
        <div className="gap-8 mt-4 max-w-4xl bg-gray2 p-12 rounded-2xl">
          {guessedAlbum && guessedAlbum.images[0] && (
            <AlbumCover
              imageUrl={guessedAlbum.images[0].url}
              visiblePanels={visiblePanels}
            />
          )}
          {guessedAlbum && <Hearts emptyHeartsCount={emptyHeartsCount} />}
          {guessedAlbum && (
            <GuessInput
              inputValue={inputValue}
              onInputChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleCheckAnswear}
              albumSuggestions={albumSuggestions}
              onSelectAlbum={handleAlbumSelection}
              pickedAlbum={pickedAlbum}
            />
          )}
          {/* {guessedAlbum && (
        <div className="text-sm break-words w-full text-gray-800 mt-4">
          Album Title: {guessedAlbum.name}
        </div>
      )} */}
          {showResult && guessedAlbum && (
            <ResultModal
              isCorrectGuess={isCorrectGuess}
              track={guessedAlbum}
              handleNextTrack={handleNextTrack}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GuessByAlbumCover;
