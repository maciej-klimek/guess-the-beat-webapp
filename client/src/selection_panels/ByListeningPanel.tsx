import React from "react";

const ByListeningPanel = () => {
  return (
    <div className="h-96 bg-neutral-900 rounded-lg text-gray-100 relative p-8">
      <h3 className="absolute top-4 left-8 text-2xl">By listening 🎧</h3>
      <div className="mt-8 -mr-20 flex bg-gray2 items-center justify-center h-96 rounded-lg border-neutral-900 border-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
        <img
          src="by_listening_preview.png"
          alt="By Listening"
          className="object-contain h-80"
        />
      </div>
    </div>
  );
};

export default ByListeningPanel;
