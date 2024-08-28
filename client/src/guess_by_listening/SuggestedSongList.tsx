import React, { useState } from "react";
import useFetchSongsName from "./useFetchSongsName";
import { useAuth } from "../auth/Auth";

interface SuggestedSongListProps {
    inputValue: string;
    onSongSelect: (song: { id: string; name: string }) => void;
}

const SuggestedSongList: React.FC<SuggestedSongListProps> = ({ inputValue, onSongSelect }) => {
    const [songSuggestions, setSongSuggestions] = useState<{ id: string; name: string; artists: { name: string }[] }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false); // State to control visibility

    const { accessToken } = useAuth();

    useFetchSongsName(inputValue, accessToken, setSongSuggestions);

    // Function to toggle the visibility of the suggested song list
    const toggleSuggestions = () => {
        setShowSuggestions((prev) => !prev);
    };

    return (
        <div className="suggested-song-list">
            {/* Button to toggle the visibility */}
            <button
                onClick={toggleSuggestions}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 mb-2"
            >
                {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
            </button>

            {/* Conditionally render the song list */}
            {showSuggestions && songSuggestions.length > 0 && (
                <ul className="list-disc p-2">
                    {songSuggestions.map((song) => (
                        <li
                            key={song.id}
                            className="p-1 cursor-pointer hover:bg-gray-200"
                            onClick={() => onSongSelect(song)}
                        >
                            {song.name} by {song.artists.map((artist) => artist.name).join(", ")}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SuggestedSongList;
