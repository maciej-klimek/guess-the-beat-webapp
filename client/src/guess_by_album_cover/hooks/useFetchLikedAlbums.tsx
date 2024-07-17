import { useEffect } from "react";
import axios from "axios";

interface Album {
  album: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}

const useFetchLikedAlbums = (
  accessToken: string,
  setLikedAlbums: React.Dispatch<React.SetStateAction<Album[]>>
) => {
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/albums",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const likedAlbums: Album[] = response.data.items.map((item: any) => ({
          album: {
            id: item.album.id,
            name: item.album.name,
            images: item.album.images,
          },
        }));
        setLikedAlbums(likedAlbums);
      } catch (error) {
        console.error("Error fetching album cover:", error);
      }
    };
    fetchAlbum();
  }, [accessToken, setLikedAlbums]);
};

export default useFetchLikedAlbums;
