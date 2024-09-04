import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TrackGuesser from "./TrackGuesser";
import { FaArrowRight } from "react-icons/fa";

interface GuessByListeningProps {
  accessToken: string;
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  preview_url: string;
}

const GuessByListening: React.FC<GuessByListeningProps> = () => {
  const location = useLocation();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const tracks: Track[] = location.state?.tracks || [];
  const playlistName: string | undefined = location.state?.playlistName;
  const [avaliavlePoints, setAvaliavlePoints] = useState(100);
  const [isArtistLocked, setIsArtistLocked] = useState(false);
  const [isDateLocked, setIsDateLocked] = useState(false);

  useEffect(() => {
    chooseRandomTrack(tracks);
  }, [tracks]);

  const chooseRandomTrack = (tracks: Track[]) => {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    setSelectedTrack(tracks[randomIndex]);
    setTimeout(() => {}, 1000);
  };

  const handleNextTrack = () => {
    chooseRandomTrack(tracks);
  };

  const handleDateClick = () => {
    if (!isDateLocked) {
      // Logic to show date information
      setIsDateLocked(true); // Lock the date button after clicking
    }
  };

  const handleArtistClick = () => {
    if (!isArtistLocked) {
      // Logic to show artist information
      setIsArtistLocked(true); // Lock the artist button after clicking
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
      <div className="absolute top-8 right-8">
        <Link
          to="/"
          className="flex items-center justify-center text-white bg-gray2 w-12 h-12 rounded-full hover:bg-neutral-800"
        >
          <FaArrowRight className="text-xl" />
        </Link>
      </div>
      <h2 className="text-4xl md:text-5xl mt-8 mb-12">
        Guess By Listening 🎧 <br />
        {playlistName && <span className="text-lg text-neutral-700">from {playlistName}</span>}
      </h2>

      <div className="flex w-full items-center justify-center space-x-28">
        {/* Available Points */}
        <div className="text-4xl flex flex-col items-start bg-gray2 p-8 rounded-2xl">
          <span className="text-sm text-neutral-700 mb-4">Points You can get:</span>
          <span>{avaliavlePoints}/100</span>
        </div>

        {/* Track Guesser */}
        {selectedTrack && (
          <div className="mx-4">
            <TrackGuesser track={selectedTrack} onNextTrack={handleNextTrack} />
          </div>
        )}

        {/* Yellow Buttons */}
        <div className="flex flex-col items-center bg-gray2 p-8 rounded-2xl">
          <h3 className="text-base text-neutral-700 font-semibold mb-4">Need some hints?</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDateClick}
                className={`py-2 w-32 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700 ${
                  isDateLocked ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDateLocked}
              >
                Date?
              </button>
              {!isDateLocked && <span className="text-red-800 text-xs">-10</span>}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleArtistClick}
                className={`py-2 w-32 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700 ${
                  isArtistLocked ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isArtistLocked}
              >
                Artist?
              </button>
              {!isArtistLocked && <span className="text-red-800 text-xs">-20</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuessByListening;
