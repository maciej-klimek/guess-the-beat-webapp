import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TrackGuesser from "./TrackGuesser";
import { FaArrowRight } from "react-icons/fa";
import HintButton from "../misc/HintButton";
import SummaryModal from "../SummaryModal"; // Import the summary modal

interface GuessByListeningProps {
  accessToken: string;
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { release_date: string; images: { url: string }[] };
  preview_url: string;
}

const GuessByListening: React.FC<GuessByListeningProps> = () => {
  const location = useLocation();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [trackQueue, setTrackQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showSummary, setGameFinished] = useState(false); // To trigger SummaryModal
  const [avaliavlePoints, setAvaliavlePoints] = useState(100);
  const [totalPoints, setTotalPoints] = useState(0); // Track total points

  const tracks: Track[] = location.state?.tracks || [];
  const playlistName: string | undefined = location.state?.playlistName;

  useEffect(() => {
    chooseRandomTracks(tracks);
  }, [tracks]);

  const chooseRandomTracks = (tracks: Track[]) => {
    const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5); // Shuffle tracks
    const selectedTracks = shuffledTracks.slice(0, 3); // Select 10 random tracks
    setTrackQueue(selectedTracks);
    setSelectedTrack(selectedTracks[0]); // Set the first track
  };

  const handleNextTrack = () => {
    // Accumulate points
    setTotalPoints((prev) => prev + avaliavlePoints);

    if (currentTrackIndex + 1 < trackQueue.length) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setSelectedTrack(trackQueue[currentTrackIndex + 1]);
      setAvaliavlePoints(100);
    } else {
      setGameFinished(true); // End the game after the selected tracks
    }
  };

  const handleDateClick = () => {
    setAvaliavlePoints(avaliavlePoints - 10);
  };

  const handleArtistClick = () => {
    setAvaliavlePoints(avaliavlePoints - 20);
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
          <span
            style={{
              color: `hsl(${(avaliavlePoints / 100) * 137}, 63%, 56%)`,
            }}
          >
            {avaliavlePoints}/100
          </span>
        </div>

        {/* Track Guesser */}
        {selectedTrack && (
          <div className="mx-4">
            <TrackGuesser
              track={selectedTrack}
              onNextTrack={handleNextTrack}
              avaliablePoints={avaliavlePoints}
              setAvaliavlePoints={setAvaliavlePoints}
            />
          </div>
        )}

        {/* Yellow Buttons */}
        <div className="flex flex-col items-center bg-gray2 p-8 rounded-2xl">
          <h3 className="text-base text-neutral-700 font-semibold mb-4">Need some hints?</h3>
          <div className="flex flex-col space-y-4 w-full">
            <div className="w-full">
              <HintButton
                labelText="Release Date"
                newText={selectedTrack?.album.release_date ?? ""}
                resetOnChangeOf={selectedTrack}
                onClick={handleDateClick}
                pointsToRemove={10}
              />
            </div>
            <div className="w-full">
              <HintButton
                labelText="Artist name"
                newText={selectedTrack?.artists[0].name ?? ""}
                resetOnChangeOf={selectedTrack}
                onClick={handleArtistClick}
                pointsToRemove={20}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && <SummaryModal finalScore={totalPoints} guessQueue={trackQueue} mode="GBL" />}
    </div>
  );
};

export default GuessByListening;
