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
    <div className="flex mt-4 relative">
      <input
        className="p-2 rounded-lg bg-gray3 text-center text-neutral-300 placeholder-neutral-600"
        type="text"
        value={inputValue}
        onChange={onInputChange}
        list="albumSuggestions"
        placeholder="What the title of this album? 🤔"
      />
      {inputValue.length > 0 && pickedAlbum === 0 && (
        <ul className="absolute list-none p-2 mt-12 w-full overflow-y-auto bg-gray3 max-h-44 rounded-xl">
          {albumSuggestions.map((album) => (
            <li
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className="flex items-center p-2 cursor-pointer hover:bg-blue-300 rounded-xl"
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
