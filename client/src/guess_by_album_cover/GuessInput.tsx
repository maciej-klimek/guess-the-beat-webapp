import React from "react";
import SubmitButton from "./SubmitButton";

interface GuessInputProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  albumSuggestions: any[];
  onSelectAlbum: (album: any) => void;
  pickedAlbum: number;
}

const GuessInput: React.FC<GuessInputProps> = ({
  inputValue,
  onInputChange,
  onSubmit,
  albumSuggestions,
  onSelectAlbum,
  pickedAlbum,
}) => {
  console.log("Album suggestions:", albumSuggestions); // Debugging log

  return (
    <div className="flex mt-6 relative">
      <input
        className="p-2 rounded-lg"
        type="text"
        value={inputValue}
        onChange={onInputChange}
        list="albumSuggestions"
        placeholder="Type an album name..."
      />
      {inputValue.length > 0 && pickedAlbum === 0 && (
        <ul className="absolute bg-white w-full mt-12 rounded-lg border border-gray-300 shadow-md max-h-64 overflow-y-auto">
          {albumSuggestions.map((album) => (
            <li
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={
                  album.images[0]
                    ? album.images[0].url
                    : "path/to/default/image.jpg"
                }
                alt="Album Cover"
                className="h-10 w-10 mr-2"
              />
              <span>{album.name}</span>
            </li>
          ))}
        </ul>
      )}
      <SubmitButton onSubmit={onSubmit} />
    </div>
  );
};

export default GuessInput;
