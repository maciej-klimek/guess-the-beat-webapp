import React, { useState, useRef, useEffect } from "react";
import PlaybackBar from "./PlaybackBar";
import ResultModal from "./ResultModal";
import PlayButton from "./PlayButton";
import UserInput from "./UserInput";
import ChancesDisplay from "./DisplayChances";
import SuggestedSongList from "./SuggestedSongList";
import UserDataManager from "../UserDataManager";
import { useAuth } from "../auth/Auth";
import { FaCheck, FaChevronDown } from "react-icons/fa";

interface TrackGuesserProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url: string;
  };
  onNextTrack: () => void;
}

const TrackGuesser: React.FC<TrackGuesserProps> = ({ track, onNextTrack }) => {
  const [userGuess, setUserGuess] = useState("");
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [remainingChances, setRemainingChances] = useState(5);
  const [playbackDuration, setPlaybackDuration] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [addSegmentsKey, setAddSegmentsKey] = useState(0);
  const [user, setUser] = useState<any>(null); // State to store user data
  const [showSuggestions, setShowSuggestions] = useState(false); // State to control suggestion list visibility

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        const userData = await UserDataManager.fetchUserData(accessToken);
        setUser(userData);
      }
    };
    fetchUserData();
  }, [accessToken]);

  const handleGuess = async () => {
    if (userGuess.toLowerCase() === track.name.toLowerCase()) {
      setIsCorrectGuess(true);
      setShowResult(true);
      if (user) {
        const newScore = (user.score ?? 0) + 100;
        await UserDataManager.updateUserScore(user.id, user.display_name, newScore);
        setUser({ ...user, score: newScore }); // Update local user state
      }
    } else {
      setRemainingChances((prev) => prev - 1);
      setPlaybackDuration((prev) => prev + 2);
      setHasPlayed(false);
      setAddSegmentsKey((prev) => prev + 1);
      if (remainingChances - 1 === 0) {
        setShowResult(true);
      }
    }
  };

  const handleNextTrack = () => {
    setIsCorrectGuess(false);
    setShowResult(false);
    setUserGuess("");
    setRemainingChances(5);
    setPlaybackDuration(2);
    setHasPlayed(false);
    setRefreshKey((prev) => prev + 1);
    onNextTrack();
  };

  const playAudioSegment = () => {
    if (!hasPlayed && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setHasPlayed(true);
      setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
      }, playbackDuration * 1000);
    }
  };

  const handleSongSelect = (song: { id: string; name: string }) => {
    setUserGuess(song.name);
    setShowSuggestions(false); // Hide suggestions after selecting a song
  };

  const toggleSuggestions = () => {
    setShowSuggestions((prev) => !prev);
  };

  return (
    <div className="w-full md:max-w-lg mx-auto">
      <div className="bg-gray2 p-6 rounded-lg shadow-md mb-4">
        <audio ref={audioRef} src={track.preview_url} className="w-full mb-4" />
        <div className="flex justify-center">
          <PlayButton playAudioSegment={playAudioSegment} isPlaying={isPlaying} />
          <PlaybackBar
            playbackDuration={playbackDuration}
            isPlaying={isPlaying}
            refreshKey={refreshKey}
            addSegmentsKey={addSegmentsKey}
          />
        </div>
        <ChancesDisplay remainingChances={remainingChances} />
        <div className="flex w-1/2 justify-between m-auto mt-6">
          <div className="flex flex-col items-center">
            <button className="px-6 py-2 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700">
              Date?
            </button>
            <span className="text-red-800 text-xs mt-1">-10</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="px-8 py-2 bg-yellow-600 text-white rounded-md shadow-md hover:bg-yellow-700">
              Artist?
            </button>
            <span className="text-red-800 text-xs mt-1">-20</span>
          </div>
        </div>
      </div>

      {/* Panel 2: Input and Buttons */}
      <div className="bg-gray2 p-6 rounded-lg shadow-md mt-6">
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center mt-6">
              <button
                onClick={toggleSuggestions}
                className="flex flex-col items-center p-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                <FaChevronDown className="text-xl" />
              </button>
              <span className="text-red-800 text-xs mt-2">-50</span>
            </div>
            <UserInput userGuess={userGuess} setUserGuess={setUserGuess} />
            <button
              onClick={handleGuess}
              className="p-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 "
            >
              <FaCheck className="text-xl" />
            </button>
          </div>
        </div>
        {showSuggestions && <SuggestedSongList inputValue={userGuess} onSongSelect={handleSongSelect} />}
      </div>

      {showResult && <ResultModal isCorrectGuess={isCorrectGuess} track={track} handleNextTrack={handleNextTrack} />}
    </div>
  );
};

export default TrackGuesser;
