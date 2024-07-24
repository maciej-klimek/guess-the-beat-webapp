import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AlbumCover from "./AlbumCover";
import GuessInput from "./GuessInput";
import Hearts from "./Hearts";
import GuessButton from "./GuessButton";
import ResultModal from "./ResultModal";
import PlaylistSelector from "./PlaylistSelector";

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

interface Playlist {
  id: string;
  name: string;
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
  const [showResult, setShowResult] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlaylistId) {
      const fetchAlbumToPlay = async () => {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setLikedAlbums(
            response.data.items.map((item: any) => ({
              id: item.track.album.id,
              images: item.track.album.images,
              release_date: item.track.album.release_date,
              name: item.track.album.name,
              artists: item.track.album.artists,
              genres: item.track.album.genres,
            }))
          );
        } catch (error) {
          console.error("Error fetching albums from playlist:", error);
          setLikedAlbums([]);
        }
      };
      fetchAlbumToPlay();
    }
  }, [selectedPlaylistId, accessToken]);

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
        const albums = response.data.albums.items.map((album: any) => ({
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
    if (likedAlbums.length > 0) {
      const randomIndex = getRandomInt(0, likedAlbums.length - 1);
      setGuessedAlbum(likedAlbums[randomIndex]);
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
    setHeartsCount(5);
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
      setHeartsCount(heartsCount - 1);
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
    setPickedAlbum(1);
    setAlbumSuggestions([]);
  };

  const handleCheckAnswear = () => {
    if (inputValue.toLowerCase() !== guessedAlbum?.name.toLowerCase()) {
      removeBlur();
      setInputValue("");
    } else {
      removeAllBlur();
      setIsCorrectGuess(true);
      setShowResult(true);
    }
  };

  const handleNextTrack = () => {
    setShowResult(false);
    handlePlayGame();
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
      {!guessedAlbum && (
        <PlaylistSelector
          accessToken={accessToken}
          onSelectPlaylist={(playlistId) => setSelectedPlaylistId(playlistId)}
          onPlaylistsLoaded={(fetchedPlaylists) => setPlaylists(fetchedPlaylists)}
        />
      )}
      {!guessedAlbum && (<GuessButton onStartGame={handlePlayGame} />)}
      {guessedAlbum && (
        <div className="mt-2 text-2xl text-green-500">
          Points: {pointCounter}
        </div>
      )}
      {guessedAlbum && guessedAlbum.images[0] && (
        <AlbumCover
          imageUrl={guessedAlbum.images[0].url}
          visiblePanels={visiblePanels}
        />
      )}
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
      {guessedAlbum && (
        <Hearts emptyHeartsCount={emptyHeartsCount} heartsCount={heartsCount} />
      )}
      {guessedAlbum && (
        <div className="text-sm break-words w-full text-gray-800 mt-4">
          Album Title: {guessedAlbum.name}
        </div>
      )}
      {showResult && guessedAlbum && (
        <ResultModal
          isCorrectGuess={isCorrectGuess}
          track={guessedAlbum}
          handleNextTrack={handleNextTrack}
        />
      )}
    </div>
  );
};

export default GuessByAlbumCover;
