import React from "react";
import { FaPlay } from "react-icons/fa";

interface PlayButtonProps {
    playAudioSegment: () => void;
    isPlaying: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ playAudioSegment }) => {
    return (
        <button onClick={playAudioSegment} className="p-6 m-6 bg-neutral-900 text-green-500 rounded-full shadow-md hover:bg-neutral-950">
            <FaPlay className="text-2xl pl-1" />
        </button>
    );
};

export default PlayButton;
