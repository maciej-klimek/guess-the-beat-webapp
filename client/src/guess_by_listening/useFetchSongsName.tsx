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
    //console.log(accessToken)
    useEffect(() => {
        const fetchSongsName = async () => {
            if (!inputValue) {
                setSongSuggestions([]);
                return;
            }

            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/search?q=${inputValue}&type=track`,
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

                // Log the fetched songs to the console
                //console.log("Fetched Songs:", songs);

                setSongSuggestions(songs);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        fetchSongsName();
    }, [inputValue, accessToken, setSongSuggestions]);
};

export default useFetchSongsName;
