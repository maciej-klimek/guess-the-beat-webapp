import React, { useState } from "react";
import useFetchSongsName from "./useFetchSongsName";
import { useAuth } from "../auth/Auth";

interface SuggestedSongListProps {
  inputValue: string;
  onSongSelect: (song: { id: string; name: string }) => void;
}

const SuggestedSongList: React.FC<SuggestedSongListProps> = ({ inputValue, onSongSelect }) => {
  const [songSuggestions, setSongSuggestions] = useState<
    {
      id: string;
      name: string;
      artists: { name: string }[];
      album: { images: { url: string }[] };
    }[]
  >([]);
  const { accessToken } = useAuth();

  useFetchSongsName(inputValue, accessToken, setSongSuggestions);

  return (
    <div className="suggested-song-list">
      {/* Conditionally render the song list or a message */}
      {songSuggestions.length > 0 ? (
        <ul className="list-none p-2 max-h-48 overflow-y-auto border-4 border-neutral-500 rounded-xl">
          {songSuggestions.map((song) => (
            <li
              key={song.id}
              className="flex items-center p-2 cursor-pointer hover:bg-neutral-300 rounded-xl"
              onClick={() => onSongSelect(song)}
            >
              {/* Display the album image */}
              <img
                src={song.album.images[0]?.url || "https://via.placeholder.com/50"} // Placeholder image if no album image is available
                alt={song.name}
                className="w-12 h-12 mr-3 rounded-md"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-left text-blue-500">{song.name}</p>
                <p className="text-neutral-700 text-left">{song.artists.map((artist) => artist.name).join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-2 text-gray-500">Type something to see suggestions</p>
      )}
    </div>
  );
};

export default SuggestedSongList;
