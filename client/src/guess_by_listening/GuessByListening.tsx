import React, { useEffect, useState } from "react";
import axios from "axios";

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
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        limit: 16,
                    },
                });
                setTopTracks(response.data.items);
            } catch (error) {
                console.error("Error fetching top tracks:", error);
            }
        };

        fetchTopTracks();
    }, [accessToken]);

    const playTrack = (track: Track) => {
        setSelectedTrack(track);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
            <h2 className="text-5xl mt-4">Guess By Listening</h2>
            <div className="w-full max-w-4xl flex-grow grid grid-cols-4 gap-4 justify-items-center mt-8">
                {topTracks.map((track, index) => (
                    <div key={index} className="p-4 border rounded-xl cursor-pointer flex flex-col items-center w-52">
                        <img src={track.album.images[0].url} alt={track.name} className="w-16 h-16 mx-auto mb-2" />
                        <h4 className="text-xl text-white text-center">{track.name}</h4>
                        <p className="text-md text-gray-700 text-center">
                            {track.artists.map((artist) => artist.name).join(", ")}
                        </p>
                        <button onClick={() => playTrack(track)} className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md">Play</button>
                    </div>
                ))}
            </div>
            {selectedTrack && (
                <div className="mb-4">
                    <h3 className="text-lg mb-2">Now Playing: {selectedTrack.name}</h3>
                    <audio controls src={selectedTrack.preview_url} className="w-full max-w-md mx-auto" />
                </div>
            )}
            <div className="break-words w-full text-gray-800 mt-4">
                Access Token: {accessToken}
            </div>
        </div>
    );
};

export default GuessByListening;
