import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TrackGuesser from "./TrackGuesser";
import { FaArrowRight } from 'react-icons/fa';

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
    const [newTrackChosen, setNewTrackChosen] = useState(false);
    const tracks: Track[] = location.state?.tracks || [];
    const playlistName: string | undefined = location.state?.playlistName;

    useEffect(() => {
        chooseRandomTrack(tracks);
    }, [tracks]);

    const chooseRandomTrack = (tracks: Track[]) => {
        const randomIndex = Math.floor(Math.random() * tracks.length);
        setSelectedTrack(tracks[randomIndex]);
        setNewTrackChosen(true);
        setTimeout(() => {
            setNewTrackChosen(false);
        }, 1000);
    };

    const handleNextTrack = () => {
        chooseRandomTrack(tracks);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
            <div className="absolute top-8 right-8">
                <Link
                    to="/"
                    className="flex items-center justify-center text-white bg-gray2 w-12 h-12 rounded-full hover:bg-neutral-800" // Circular button with center-aligned icon
                >
                    <FaArrowRight className="text-xl" /> {/* Adjust icon size as needed */}
                </Link>
            </div>
            <h2 className="text-4xl md:text-5xl mt-8 mb-20">
                Guess By Listening 🎧 <br />
                {playlistName && <span className="text-sm text-gray-700">from {playlistName}</span>}
            </h2>
            {newTrackChosen && (
                <div className="text-sm text-gray3 mt-4 absolute left-1/2 top-3/4 transform -translate-x-1/2">
                    New track chosen!
                </div>
            )}
            {selectedTrack && (
                <TrackGuesser
                    track={selectedTrack}
                    onNextTrack={handleNextTrack}
                />
            )}
        </div>
    );
};

export default GuessByListening;
