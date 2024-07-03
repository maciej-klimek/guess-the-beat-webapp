import React, { useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import SongTimer from "./SongTimer";

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
    const [incorrectGuess, setIncorrectGuess] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleGuess = () => {
        if (userGuess.toLowerCase() === track.name.toLowerCase()) {
            setIsCorrectGuess(true);
            setShowResult(true);
        } else {
            setRemainingChances(prev => prev - 1);
            setPlaybackDuration(prev => prev + 2);
            setHasPlayed(false); // Reset the play flag for the next guess
            setIncorrectGuess(true); // Set incorrect guess flag to true
            setTimeout(() => {
                setIncorrectGuess(false); // Clear the incorrect guess flag after 1 second
            }, 1000);
            if (remainingChances - 1 === 0) {
                setShowResult(true);
            }
        }
    };

    const handleNextTrack = () => {
        setIsCorrectGuess(false);
        setShowResult(false);
        setUserGuess("");
        setRemainingChances(5); // Reset remaining chances
        setPlaybackDuration(2); // Reset playback duration
        setHasPlayed(false); // Reset the play flag for the new track
        setIncorrectGuess(false); // Reset incorrect guess flag
        onNextTrack();
    };

    const playAudioSegment = () => {
        if (!hasPlayed && audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
            setHasPlayed(true); // Set the play flag to true
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
                    <button onClick={playAudioSegment} className="p-6 m-6 bg-neutral-900 text-green-500 rounded-full shadow-md hover:bg-neutral-950">
                        <FaPlay className="text-2xl pl-1" />
                    </button>
                    <SongTimer playbackDuration={playbackDuration} isPlaying={isPlaying} />
                </div>
                {incorrectGuess && (
                    <p className="text-red-500 text-sm">Incorrect!</p>
                )}
                <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    className="mt-4 mb-4 px-4 py-2 rounded-md w-11/12 bg-gray3 text-center text-neutral-300 placeholder-neutral-600"
                    placeholder="What the title of this song?"
                />
                <div className="text-center">
                    <p className="text-sm text-neutral-600">Remaining Chances: {remainingChances}</p>
                </div>
                <div className="flex justify-center mt-8 mb-4">
                    <button onClick={handleGuess} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 mr-2">
                        Submit Guess
                    </button>
                    <button onClick={handleNextTrack} className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 ml-2">
                        Different Track
                    </button>
                </div>
            </div>
            {showResult && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        {
                            isCorrectGuess ? (
                                <h3 className="text-2xl mb-4">
                                    Correct! 🎉
                                </h3>
                            ) : (
                                <h3 className="text-2xl mb-4 text-red-500">
                                    Out of Chances! 😞
                                </h3>
                            )
                        }

                        <img src={track.album.images[0].url} alt={track.name} className="w-32 h-32 mx-auto mb-4 rounded-xl" />
                        <p className="text-lg font-semibold text-gray-800">{track.name}</p>
                        <p className="text-md text-gray-600">by {track.artists.map(artist => artist.name).join(", ")}</p>
                        <button onClick={handleNextTrack} className={`mt-4 px-4 py-2 ${isCorrectGuess ? 'bg-green-500' : 'bg-red-500'} text-white rounded-md shadow-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50`}>
                            Next Track
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackGuesser;
