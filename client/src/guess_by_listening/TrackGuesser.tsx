import React, { useState, useRef } from "react";
import SongTimer from "./PlaybackTimer";
import ResultModal from "./ResultModal";
import PlayButton from "./PlayButton";
import UserInput from "./UserInput";
import ChancesDisplay from "./DisplayChances";

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
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleGuess = () => {
        if (userGuess.toLowerCase() === track.name.toLowerCase()) {
            setIsCorrectGuess(true);
            setShowResult(true);
        } else {
            setRemainingChances(prev => prev - 1);
            setPlaybackDuration(prev => prev + 2);
            setHasPlayed(false);
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

    return (
        <div className="mb-4 w-full md:max-w-lg bg-gray2 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4">
                <audio ref={audioRef} src={track.preview_url} className="w-full mb-4" />
                <div className="flex justify-center">
                    <PlayButton playAudioSegment={playAudioSegment} isPlaying={isPlaying} />
                    <SongTimer playbackDuration={playbackDuration} isPlaying={isPlaying} />
                </div>
                <UserInput userGuess={userGuess} setUserGuess={setUserGuess} />
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
                <ResultModal
                    isCorrectGuess={isCorrectGuess}
                    track={track}
                    handleNextTrack={handleNextTrack}
                />
            )}
        </div>
    );
};

export default TrackGuesser;
