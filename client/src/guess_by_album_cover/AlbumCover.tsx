import React from "react";

interface AlbumCoverProps {
  imageUrl: string;
  visiblePanels: number[];
}

const AlbumCover: React.FC<AlbumCoverProps> = ({ imageUrl, visiblePanels }) => {
  return (
    <div className="relative flex items-center">
      <img className="mx-auto p-2 w-80 h-80" src={imageUrl} alt="Album Cover" />
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
  );
};

export default AlbumCover;
