import React from "react";
import SubmitButton from "./SubmitButton";

interface GuessInputProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  albumSuggestions: any[];
  onSelectAlbum: (album: any) => void;
}

const GuessInput: React.FC<GuessInputProps> = ({
  inputValue,
  onInputChange,
  onSubmit,
  albumSuggestions,
  onSelectAlbum,
}) => {
  //console.log("Album suggestions:", albumSuggestions); // Debugging log

  return (
    <div className="flex mt-4 relative">
      <input
        className="mr-4 p-2 rounded-lg bg-gray3 text-center text-neutral-300 placeholder-neutral-600"
        type="text"
        value={inputValue}
        onChange={onInputChange}
        list="albumSuggestions"
        placeholder="What the title of this album? 🤔"
      />
      {inputValue.length > 0 && (
        <ul className="absolute list-none p-2 mt-14 w-full max-h-44 overflow-y-auto bg-gray3 rounded-xl">
          {albumSuggestions.map((album) => (
            <li
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className="flex items-center p-2 cursor-pointer hover:bg-blue-300 rounded-xl"
            >
              {/* Album image */}
              <img
                src={
                  album.images[0]
                    ? album.images[0].url
                    : "https://via.placeholder.com/50"
                }
                alt="Album Cover"
                className="h-10 w-10 mr-3 rounded-md"
              />
              {/* Album name */}
              <div className="flex flex-col">
                <p className="font-semibold text-left text-sm text-blue-500">
                  {album.name}
                </p>
                <p className="text-neutral-700 text-left text-sm">
                  {/* Assuming artist names are available similarly */}
                  {album.artists
                    .map((artist: { name: string }) => artist.name)
                    .join(", ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <SubmitButton onSubmit={onSubmit} />
    </div>
  );
};

export default GuessInput;
