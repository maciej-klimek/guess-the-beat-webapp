import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TrackGuesser from "./TrackGuesser";

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

const GuessByListening: React.FC<GuessByListeningProps> = ({ accessToken }) => {
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
        <div className="min-h-screen flex flex-col justify-between items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
            <div className="absolute top-6 right-4">
                <Link to="/" className="text-white bg-gray2 p-2 rounded hover:bg-gray-800">
                    Home
                </Link>
            </div>
            <h2 className="text-4xl md:text-5xl mt-8 mb-4">
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
            <div className="text-sm break-words w-full text-gray-700 mt-4 text-center">
                Access Token: {accessToken}
            </div>
        </div>
    );
};

export default GuessByListening;
