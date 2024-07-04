import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Playlist {
    id: string;
    name: string;
    url: string;
    imageUrl?: string; // Optional imageUrl property
}

interface PlaylistSelectionProps {
    accessToken: string;
}

const PlaylistSelection: React.FC<PlaylistSelectionProps> = ({ accessToken }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [playlistUrl, setPlaylistUrl] = useState("");
    const [error, setError] = useState("");

    const playlists: Playlist[] = [
        { id: "top", name: "My Top Songs", url: "https://api.spotify.com/v1/me/top/tracks" },
        { id: "rock", name: "100 Rock Hits", url: "https://api.spotify.com/v1/playlists/61jNo7WKLOIQkahju8i0hw" },
        { id: "disco", name: "80 Disco Hits", url: "https://api.spotify.com/v1/playlists/37i9dQZF1DXb57FjYWz00c" },
    ];

    const fetchTracks = async (playlistId: string, url: string) => {
        setLoading(true);
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    limit: 50,
                },
            });

            const tracks = playlistId === "top" ? response.data.items : response.data.tracks.items.map((item: any) => item.track);
            const playlistName = playlistId === "top" ? "Your Top Songs" : response.data.name;
            const playlistImageUrl = playlistId === "top" ? "liked-songs-icon.png" : response.data.images.length > 0 ? response.data.images[0].url : "";

            navigate(`/guess-by-listening/${playlistId}`, { state: { tracks, playlistName } });
        } catch (error) {
            console.error("Error fetching tracks:", error);
            setError("Error fetching tracks. Please check the URL and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistUrl(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try {
            const playlistId = extractPlaylistIdFromUrl(playlistUrl);
            if (playlistId) {
                const playlistApiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
                await fetchTracks(playlistId, playlistApiUrl);
            } else {
                setError("Invalid Spotify playlist URL.");
            }
        } catch (error) {
            console.error("Error processing playlist URL:", error);
            setError("Error processing playlist URL. Please try again.");
        }
    };

    const extractPlaylistIdFromUrl = (url: string): string | null => {
        const regex = /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)\??.*$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
            <h2 className="text-4xl md:text-5xl mt-8 mb-4">Select a Playlist to Guess From 🎧</h2>
            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                    <button
                        key={playlist.id}
                        onClick={() => fetchTracks(playlist.id, playlist.url)}
                        className="p-6 bg-gray2 rounded-lg shadow-lg hover:bg-gray-800 text-white text-xl"
                    >
                        {playlist.name}
                    </button>
                ))}
                <form onSubmit={handleSubmit} className="md:col-span-3 mt-4">
                    <input
                        type="text"
                        value={playlistUrl}
                        onChange={handlePaste}
                        placeholder="Paste Spotify playlist URL"
                        className="px-4 py-2 rounded-md bg-gray3 text-neutral-300 mr-2"
                    />
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600">
                        Start Game
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlaylistSelection;
