import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlbumCover from "./AlbumCover";
import GuessInput from "./GuessInput";
import Hearts from "./Hearts";
import ResultModal from "./ResultModalBGAC";
import { FaArrowLeft } from "react-icons/fa";
import UserDataManager from "../UserDataManager";
import HintButton from "../misc/HintButton";
import { normalizeTitle } from "../misc/normalizeTitle";
import SummaryModal from "../SummaryModal";

interface GuessByAlbumCoverProps {
  accessToken: string;
}

interface Album {
  id: string;
  images: { url: string }[];
  release_date: string;
  name: string;
  artists: { name: string }[];
  genres?: string[];
}

const GuessByAlbumCover: React.FC<GuessByAlbumCoverProps> = ({ accessToken }) => {
  // State declarations
  const [visiblePanelsArray, setVisiblePanelsArray] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [failsCount, setFailsCount] = useState(0);
  const [albumSuggestionsArray, setAlbumSuggestions] = useState<Album[]>([]);
  const [pointCount, setPointCount] = useState(100);
  const [pointSummary, setPointSummary] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [albumQueue, setAlbumQueue] = useState<Album[]>([]); // New state to track album queue

  const location = useLocation();
  const albums: Album[] = location.state?.albums || [];
  const playlistName: string | undefined = location.state?.playlistName;

  // Effect to fetch user data and load the first album
  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        const userData = await UserDataManager.fetchUserData(accessToken);
        setUserData(userData);
      }
    };

    fetchUserData();
    handleNextAlbum();
  }, [accessToken]);

  // Effect to fetch album suggestions based on input value
  useEffect(() => {
    const fetchAlbumSuggestions = async () => {
      if (!inputValue) {
        setAlbumSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${inputValue}&type=album`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
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

  // Utility function to get a random integer between min and max
  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Event handler to handle next album
  const handleNextAlbum = () => {
    setVisiblePanelsArray([]);
    setInputValue("");
    setFailsCount(0);
    setPointCount(100);
    setShowResult(false);
    //setIsCorrectGuess(false);
    if (albums.length > 0) {
      const randomIndex = getRandomInt(0, albums.length - 1);
      const selectedAlbum = albums[randomIndex];
      setSelectedAlbum(selectedAlbum);
      setAlbumQueue((prevQueue) => [...prevQueue, selectedAlbum]); // Add to albumQueue
      albums.splice(randomIndex, 1);
    } else {
      setShowSummary(true);
      //console.warn("No albums found in the selected playlist");
    }
  };

  // Event handler to remove blur effect and update state
  const removeBlur = async () => {
    return new Promise<void>((resolve) => {
      const availableIndexes = Array.from({ length: 9 }, (_, index) => index).filter(
        (index) => !visiblePanelsArray.includes(index)
      );

      if (availableIndexes.length > 0) {
        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        setVisiblePanelsArray((prev) => [...prev, randomIndex]);
        setFailsCount((prev) => prev + 1);
        setPointCount((prev) => prev - 20);

        resolve();
      } else {
        resolve();
      }
    });
  };

  // Event handler for album selection
  const handleAlbumSelection = (selectedAlbum: Album) => {
    setInputValue(selectedAlbum.name ?? "");
    setAlbumSuggestions([]);
  };

  // Event handler to check the user's answer
  const handleCheckAnswer = async () => {
    if (normalizeTitle(inputValue) !== normalizeTitle(selectedAlbum?.name ?? "")) {
      await removeBlur(); // Wait for removeBlur to complete
      if (failsCount >= 4) {
        setInputValue("");
        setPointCount((prev) => prev - 50);
        setIsCorrectGuess(false);
        setShowResult(true);
        setPointSummary((prev) => prev - 50); // Deduct 50 points for a loss
        if (userData) {
          UserDataManager.updateUserScore(
            userData.id,
            userData.display_name,
            userData.score - 50 // Deduct 50 points for a loss
          );
          setUserData((prev) => ({
            ...prev,
            score: prev?.score - 50,
          }));
        }
      }
    } else {
      setIsCorrectGuess(true);
      setInputValue("");
      setShowResult(true);
      setPointSummary((prev) => prev + pointCount);
      // Update the user score only on correct guess
      if (userData) {
        const newScore = (userData.score ?? 0) + pointCount;
        await UserDataManager.updateUserScore(userData.id, userData.display_name, newScore);
        setUserData((prev) => ({ ...prev, score: newScore }));
      }
    }
  };

  // Event handlers for hint buttons
  const handleDateClick = () => {
    setPointCount((prev) => prev - 10);
  };

  const handleArtistClick = () => {
    setPointCount((prev) => prev - 10);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4 relative">
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="flex items-center justify-center text-white bg-gray2 w-12 h-12 rounded-full hover:bg-neutral-800 transition-transform duration-200 ease-in-out transform hover:scale-110"
        >
          <FaArrowLeft className="text-xl" />
        </Link>
      </div>
      <h2 className="text-4xl md:text-5xl mt-6">
        Guess By Album Cover 💽 <br />
        {playlistName && <span className="text-lg text-gray-700">from {playlistName}</span>}
      </h2>
      <div className="flex w-full items-center justify-center space-x-28">
        {/* Available Points */}
        <div className="text-4xl flex flex-col items-start bg-gray2 p-8 rounded-2xl">
          <span className="text-sm text-neutral-700 mb-4">Points You can get:</span>
          <span style={{ color: `hsl(${(pointCount / 100) * 137}, 63%, 56%)` }}>{pointCount}/100</span>
        </div>

        {/* Album Cover & Guess Input */}
        {selectedAlbum && (
          <div className="gap-8 mt-4 max-w-4xl bg-gray2 p-12 rounded-2xl">
            {selectedAlbum.images[0] && (
              <AlbumCover imageUrl={selectedAlbum.images[0].url} visiblePanels={visiblePanelsArray} />
            )}
            <Hearts emptyHeartsCount={failsCount} />
            <GuessInput
              inputValue={inputValue}
              onInputChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleCheckAnswer}
              albumSuggestions={albumSuggestionsArray}
              onSelectAlbum={handleAlbumSelection}
              pickedAlbum={0}
            />

            {showResult && (
              <ResultModal
                isCorrectGuess={isCorrectGuess}
                track={selectedAlbum}
                handleNextTrack={handleNextAlbum}
                avaliablePoints={pointCount} // Use avaliablePoints to match the prop name in ResultModal
              />
            )}
          </div>
        )}

        {/* Hint Buttons */}
        <div className="flex flex-col items-center bg-gray2 p-8 rounded-2xl">
          <h3 className="text-base text-neutral-700 font-semibold mb-4">Need some hints?</h3>
          <div className="flex flex-col space-y-4 w-full">
            <div className="w-full">
              <HintButton
                labelText="Artist name"
                newText={selectedAlbum?.artists[0].name ?? ""}
                resetOnChangeOf={selectedAlbum}
                onClick={handleArtistClick}
                pointsToRemove={10}
              />
            </div>
            <div className="w-full">
              <HintButton
                labelText="Release Date"
                newText={selectedAlbum?.release_date ?? ""}
                resetOnChangeOf={selectedAlbum}
                onClick={handleDateClick}
                pointsToRemove={10}
              />
            </div>
          </div>
        </div>
      </div>

      {showSummary && <SummaryModal finalScore={pointSummary} guessQueue={albumQueue} mode="BGAC" />}
    </div>
  );
};

export default GuessByAlbumCover;
