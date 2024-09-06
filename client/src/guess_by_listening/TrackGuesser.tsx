import React, { useState, useRef, useEffect } from "react";
import PlaybackBar from "./PlaybackBar";
import ResultModal from "./ResultModalGBL";
import PlayButton from "./PlayButton";
import UserInput from "./UserInput";
import ChancesDisplay from "./DisplayChances";
import SuggestedSongList from "./SuggestedSongList";
import UserDataManager from "../UserDataManager";
import { useAuth } from "../auth/Auth";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { normalizeTitle } from "../misc/normalizeTitle";

interface TrackGuesserProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url: string;
  };
  onNextTrack: () => void;
  avaliablePoints: number;
  setAvaliavlePoints: (avaliablePoints: number) => void;
}

const TrackGuesser: React.FC<TrackGuesserProps> = ({
  track,
  onNextTrack,
  avaliablePoints,
  setAvaliavlePoints,
}) => {
  const [userGuess, setUserGuess] = useState("");
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [remainingChances, setRemainingChances] = useState(5);
  const [playbackDuration, setPlaybackDuration] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [addSegmentsKey, setAddSegmentsKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestionsLocked, setIsSuggestionsLocked] = useState(false);

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
    if (normalizeTitle(userGuess) === normalizeTitle(track.name)) {
      setIsCorrectGuess(true);
      setShowResult(true);
      if (user) {
        const newScore = (user.score ?? 0) + avaliablePoints;
        await UserDataManager.updateUserScore(
          user.id,
          user.display_name,
          newScore
        );
        setUser({ ...user, score: newScore });
      }
    } else {
      setRemainingChances((prev) => prev - 1);
      setPlaybackDuration((prev) => prev + 2);
      setAvaliavlePoints(avaliablePoints - 10);
      setAddSegmentsKey((prev) => prev + 1);
      if (remainingChances - 1 === 0) {
        setShowResult(true);
        if (user) {
          const newScore = (user.score ?? 0) - 50;
          await UserDataManager.updateUserScore(
            user.id,
            user.display_name,
            newScore
          );
          setUser({ ...user, score: newScore });
        }
      }
    }
  };

  const handleNextTrack = () => {
    setIsCorrectGuess(false);
    setShowResult(false);
    setUserGuess("");
    setRemainingChances(5);
    setPlaybackDuration(2);
    setRefreshKey((prev) => prev + 1);
    setIsSuggestionsLocked(false);
    setShowSuggestions(false);
    onNextTrack();
  };

  const playAudioSegment = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
      }, playbackDuration * 1000);
    }
  };

  const handleSongSelect = (song: { id: string; name: string }) => {
    setUserGuess(song.name);
  };

  const toggleSuggestions = () => {
    if (!isSuggestionsLocked) {
      setAvaliavlePoints(avaliablePoints - 50);
      setShowSuggestions((prev) => !prev);
      setIsSuggestionsLocked(true);
    }
  };

  return (
    <div className="w-full md:max-w-lg mx-auto mt-8">
      {/* Panel 1: Top Section */}
      <div className="bg-gray2 p-8 rounded-xl shadow-md mb-4 ">
        <audio ref={audioRef} src={track.preview_url} className="w-full mb-4" />
        <div className="flex justify-self-center">
          <PlayButton
            playAudioSegment={playAudioSegment}
            isPlaying={isPlaying}
          />
          <PlaybackBar
            playbackDuration={playbackDuration}
            isPlaying={isPlaying}
            refreshKey={refreshKey}
            addSegmentsKey={addSegmentsKey}
          />
        </div>
        <ChancesDisplay remainingChances={remainingChances} />
        <div className="bg-gray1 h-1 w-full mt-8 mb-2 rounded-xl"></div>
        <div className="flex justify-center ">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <button
                onClick={toggleSuggestions}
                className={`flex flex-col items-center p-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 mt-6 ${
                  isSuggestionsLocked
                    ? "opacity-50 cursor-not-allowed mb-6"
                    : ""
                }`}
                disabled={isSuggestionsLocked}
              >
                <FaChevronDown className="text-xl" />
              </button>
              {!isSuggestionsLocked && (
                <span className="text-red-800 text-xs mt-2">-50</span>
              )}
            </div>
            <UserInput userGuess={userGuess} setUserGuess={setUserGuess} />
            <button
              onClick={handleGuess}
              className="p-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
            >
              <FaCheck className="text-xl" />
            </button>
          </div>
        </div>
        {showSuggestions && (
          <SuggestedSongList
            inputValue={userGuess}
            onSongSelect={handleSongSelect}
          />
        )}
      </div>

      {showResult && (
        <ResultModal
          isCorrectGuess={isCorrectGuess}
          track={track}
          handleNextTrack={handleNextTrack}
          avaliablePoints={avaliablePoints}
        />
      )}
    </div>
  );
};

export default TrackGuesser;
