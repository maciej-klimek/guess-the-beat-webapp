import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const fetchAlbumsName = async () => {
      if(!inputValue){
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
        console.log(response.data.albums.items[0].images[2].url);
        const albums = response.data.albums.items.map((album: any) => ({
          album: {
            id: album.id,
            name: album.name,
            imageUrl: album.images[2]?.url 
          },
          
        }));
        setAlbumSuggestions(albums);
        console.log(albums.name)
      } catch (error) {
        console.error("Error fetching search:", error);
      }
    };
    fetchAlbumsName();
  }, [inputValue, accessToken]);

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
      setEmptyHeartsCount(emptyHeartsCount + 1);
      setHeartsCount(heartsCount - 1);
      if (emptyHeartsCount === 4) {
        removeAllBlur();
        setEmptyHeartsCount(0);
        setHeartsCount(5);
        alert("Niestety przegrałeś, spróbuj ponownie :)");
      }
    }
  };

  const removeAllBlur = () => {
    const allIndexes = Array.from({ length: 9 }, (_, index) => index);
    setVisiblePanels(allIndexes);
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleChange = () => {
    if (inputValue.toLowerCase() !== guessedAlbum?.album.name.toLowerCase()) {
      removeBlur();
    } else {
      removeAllBlur();
      alert("Gratulacje, udało Ci się odgadnąć nazwę!");
    }
  };

  const handleAlbumSelection = (selectedAlbum: Album) => {
    setInputValue(selectedAlbum.album.name);
    setAlbumSuggestions([]);
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
        onClick={() =>
          setGuessedAlbum(
            likedAlbums[getRandomInt(0, likedAlbums.length - 1)]
          )
        }
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
      <div className="flex mt-6">
        <input
          className="p-2 rounded-lg"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          list="albumSuggestions"
          placeholder="Wpisz nazwę albumu..."
        />
        {inputValue.length > 0 && (
          <ul className="absolute bg-white w-300 mt-1 rounded-lg border border-gray-300 shadow-md max-h-40 overflow-y-auto">
            {albumSuggestions.map((album) => (
              <li
                key={album.album.id}
                onClick={() => handleAlbumSelection(album)}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={album.album.imageUrl}
                  alt="Album Cover"
                  className="h-10 w-10 mr-2"
                />
                <span>{album.album.name}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleChange}
          className="p-2 bg-blue-500 hover:bg-slate-600 text-white rounded-lg ml-4"
        >
          Submit
        </button>
      </div>
      <div className="mt-4 flex">
        {Array.from({ length: emptyHeartsCount }, (_, index) => (
          <FaRegHeart key={index} className="text-red-600 mr-1" />
        ))}
        {Array.from({ length: heartsCount }, (_, index) => (
          <FaHeart key={index} className="text-red-600 mr-1" />
        ))}
      </div>
      <div className="text-sm break-words w-full text-stone-800 mt-4">
        Access Token: {accessToken}
      </div>
      {guessedAlbum && (
        <div className="text-sm break-words w-full text-stone-800 mt-4">
          Album Title: {guessedAlbum.album.name}
        </div>
      )}
    </div>
  );
};

export default GuessByAlbumCover;
