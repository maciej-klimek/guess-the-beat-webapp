import { useEffect } from "react";
import axios from "axios";

interface Album {
  album: {
    id: string;
    images: { url: string }[];
    release_date: string;
    name: string;
    artists: { name: string }[];
    genres: string[];
  };
}

const useFetchAlbumsName = (
  inputValue: string,
  accessToken: string,
  setAlbumSuggestions: React.Dispatch<React.SetStateAction<Album[]>>
) => {
  useEffect(() => {
    const fetchAlbumsName = async () => {
      if (!inputValue) {
        setAlbumSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${inputValue}&type=album`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const albums: Album[] = response.data.albums.items.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (album: any) => ({
            album: {
              id: album.id,
              name: album.name,
              imageUrl: album.images[2]?.url,
            },
          })
        );
        setAlbumSuggestions(albums);
      } catch (error) {
        console.error("Error fetching search:", error);
      }
    };
    fetchAlbumsName();
  }, [inputValue, accessToken, setAlbumSuggestions]);
};

export default useFetchAlbumsName;
