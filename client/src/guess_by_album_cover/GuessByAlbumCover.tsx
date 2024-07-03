import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

interface GuessByAlbumCoverProps {
  accessToken: string;
}

interface Album {
  album: {
    images: { url: string }[];
    realese_date: string;
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

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/albums",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setLikedAlbums(response.data.items);
        console.log(likedAlbums[1]);
      } catch (error) {
        console.error("Error fetching album cover:", error);
      }
    };
    fetchAlbum();
  }, [accessToken]);

  const removeBlur = () => {
    const availableIndexes = Array.from(
      { length: 9 },
      (_, index) => index
    ).filter((index) => !visiblePanels.includes(index));

    if (availableIndexes.length > 0) {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      setVisiblePanels([...visiblePanels, randomIndex]);
    }
  };

  const handleChange = () => {
    if (inputValue !== guessedAlbum?.album.name.toLowerCase()) {
      removeBlur();
    }
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
        onClick={() => setGuessedAlbum(likedAlbums[10])}
        className="mt-10 px-3 py-1 bg-green-500 text-white rounded-md"
      >
        ZGADUJ!
      </button>
      <div className="relative flex items-center mt-10">
        {guessedAlbum?.album.images[0].url ? (
          <img
            className="mx-auto p-2 w-80 h-80"
            src={guessedAlbum?.album.images[0].url}
            alt="Album Cover"
          />
        ) : (
          <img
            className="mx-auto p-2 w-80 h-80"
            src="album_placeholder.jpg"
            alt="Album Cover"
          />
        )}
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
      <div className="flex mt-16">
        <input
          className="p-2 rounded-lg"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleChange}
          className="p-2 bg-blue-500 hover:bg-slate-600 text-white rounded-lg ml-4"
        >
          Submit
        </button>
      </div>
      <div className="mt-4 flex">
        <FaHeart className="text-red-600 mr-1" />
        <FaHeart className="text-red-600 mr-1" />
        <FaHeart className="text-red-600 mr-1" />
        <FaHeart className="text-red-600 mr-1" />
        <FaHeart className="text-red-600 mr-1" />
      </div>
      <div className="text-sm break-words w-full text-stone-800 mt-4">
        Access Token: {accessToken}
      </div>
    </div>
  );
};

export default GuessByAlbumCover;
