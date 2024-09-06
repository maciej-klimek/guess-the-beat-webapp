import React from "react";

const ByAlbumCoverPanel = () => {
  return (
    <div className="h-96 bg-neutral-900 rounded-lg text-gray-100 relative p-8">
      <h3 className="absolute top-4 right-8 text-2xl">By album cover 🌆</h3>
      <div className="mt-8 -ml-20 flex bg-gray2 items-center justify-center h-96 rounded-lg border-neutral-900 border-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
        <img
          src="by_album_preview.png"
          alt="By Listening"
          className="object-contain h-5/6"
        />
      </div>
    </div>
  );
};

export default ByAlbumCoverPanel;
