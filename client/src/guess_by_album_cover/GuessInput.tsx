import React from "react";

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
  return (
    <div className="flex mt-6 relative">
      <input
        className="p-2 rounded-lg"
        type="text"
        value={inputValue}
        onChange={onInputChange}
        list="albumSuggestions"
        placeholder="Wpisz nazwę albumu..."
      />
      {inputValue.length > 0 && pickedAlbum === 0 && (
        <ul className="absolute bg-white w-full mt-12 rounded-lg border border-gray-300 shadow-md max-h-64 overflow-y-auto">
          {albumSuggestions.map((album) => (
            <li
              key={album.album.id}
              onClick={() => onSelectAlbum(album)}
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
        onClick={onSubmit}
        className="p-2 bg-blue-500 hover:bg-slate-600 text-white rounded-lg ml-4"
      >
        Submit
      </button>
    </div>
  );
};

export default GuessInput;
