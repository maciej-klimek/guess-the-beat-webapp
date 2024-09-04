import { useEffect } from "react";
import axios from "axios";

interface Song {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
}

const useFetchSongsName = (
    inputValue: string,
    accessToken: string | null,
    setSongSuggestions: React.Dispatch<React.SetStateAction<Song[]>>
) => {
    useEffect(() => {
        const fetchSongsName = async () => {
            if (!inputValue) {
                setSongSuggestions([]);
                return;
            }

            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/search?q=${inputValue}&type=track&limit=10`, // Added limit=10 here
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const songs: Song[] = response.data.tracks.items.map((track: any) => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map((artist: any) => ({ name: artist.name })),
                    album: {
                        images: track.album.images,
                    },
                }));

                setSongSuggestions(songs);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        fetchSongsName();
    }, [inputValue, accessToken, setSongSuggestions]);
};

export default useFetchSongsName;
