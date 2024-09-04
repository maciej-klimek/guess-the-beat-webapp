import React, { useState, useRef, useEffect } from "react";
import PlaybackBar from "./PlaybackBar";
import ResultModal from "./ResultModal";
import PlayButton from "./PlayButton";
import UserInput from "./UserInput";
import ChancesDisplay from "./DisplayChances";
import SuggestedSongList from "./SuggestedSongList";
import UserDataManager from "../UserDataManager";
import { useAuth } from "../auth/Auth";


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
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const { accessToken } = useAuth()
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
        //console.log("Trying to update score")
        await UserDataManager.updateUserScore(user.id, user.display_name, newScore);
        //console.log("Recevied confirmation")
        setUser({ ...user, score: newScore }); // Update local user state
        //console.log("Updated Score")
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
  };

  return (
    <div className="mb-4 w-full md:max-w-lg bg-gray2 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4">
        <audio ref={audioRef} src={track.preview_url} className="w-full mb-4" />
        <div className="flex justify-center">
          <PlayButton playAudioSegment={playAudioSegment} isPlaying={isPlaying} />
          <PlaybackBar playbackDuration={playbackDuration} isPlaying={isPlaying} refreshKey={refreshKey} addSegmentsKey={addSegmentsKey} />
        </div>
        <UserInput userGuess={userGuess} setUserGuess={setUserGuess} />
        <SuggestedSongList inputValue={userGuess} onSongSelect={handleSongSelect} />
        <ChancesDisplay remainingChances={remainingChances} />
        <div className="flex justify-center mt-8 mb-4">
          <button onClick={handleGuess} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 mr-2">
            Submit Guess 😎
          </button>
          <button onClick={handleNextTrack} className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 ml-2">
            Different Track 🎵
          </button>
        </div>
      </div>
      {showResult && (
        <ResultModal isCorrectGuess={isCorrectGuess} track={track} handleNextTrack={handleNextTrack} />
      )}
    </div>
  );
};

export default TrackGuesser;
