import React from "react";

const ByAlbumCoverPanel = () => {
    return (
        <div className="h-96 bg-gray2 rounded-lg text-gray-100 relative p-8">
            <h3 className="absolute top-4 right-8 text-2xl">By album cover 🌆</h3>
            <div className="mt-8 -ml-20 flex bg-gray3 items-center justify-center h-96 rounded-lg">
                <img src="by_album_preview.png" alt="By Listening" className="object-contain h-full w-auto" />
            </div>
        </div>
    );
};

export default ByAlbumCoverPanel;
