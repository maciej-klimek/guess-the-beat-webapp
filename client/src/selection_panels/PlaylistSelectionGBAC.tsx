import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Loading from "../misc/Loading";

interface Playlist {
  id: string;
  name: string;
  url: string;
  imageUrl?: string;
}

interface PlaylistSelectionProps {
  accessToken: string;
}

const PlaylistSelection: React.FC<PlaylistSelectionProps> = ({
  accessToken,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "top",
      name: "Your Top Songs",
      url: "https://api.spotify.com/v1/me/top/tracks",
      imageUrl: "liked-songs-icon.png",
    },
    {
      id: "rock",
      name: "Rock Classics",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DWXRqgorJj26U",
    },
    {
      id: "disco",
      name: "80s Disco Hits",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DXb57FjYWz00c",
    },
    {
      id: "pop",
      name: "Pop Hits",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DX4v0Y84QklHD",
    },
    {
      id: "rap",
      name: "Rap Classics",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DXbkfWVLd8wE3",
    },
    {
      id: "rock_pl",
      name: "Polski Rock",
      url: "https://api.spotify.com/v1/playlists/1UZuFEO1iIad6ys4S9Teor",
    },
    {
      id: "10s",
      name: "All out of 2010s",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DX5Ejj0EkURtP",
    },
    {
      id: "hits_pl",
      name: "Poskie Przeboje Wszechczasów",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DX8J2l55TrZk6",
    },
    {
      id: "00_metal_classics",
      name: "00s Metal Classics",
      url: "https://api.spotify.com/v1/playlists/37i9dQZF1DWXNFSTtym834",
    },
  ]);

  useEffect(() => {
    const fetchImagesForPredefinedPlaylists = async () => {
      const updatedPlaylists = await Promise.all(
        playlists.map(async (playlist) => {
          if (playlist.imageUrl) {
            return playlist;
          } else {
            const imageUrl = await fetchPlaylistImage(playlist);
            return { ...playlist, imageUrl };
          }
        })
      );
      setPlaylists(updatedPlaylists);
      setImagesLoaded(true);
    };
    fetchImagesForPredefinedPlaylists();
  }, [accessToken]);

  const fetchPlaylistImage = async (playlist: Playlist) => {
    try {
      const response = await axios.get(playlist.url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const playlistImageUrl =
        response.data.images.length > 0 ? response.data.images[0].url : "";
      return playlistImageUrl;
    } catch (error) {
      console.error("Error fetching playlist image:", error);
      return "";
    }
  };

  interface Album {
    id: string;
    images: { url: string }[];
    release_date: string;
    name: string;
    artists: { name: string }[];
    genres?: string[];
  }

  const fetchAlbums = async (playlistId: string, url: string) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const totalTracks = playlistId === "top" ? response.data.total : response.data.tracks.total;

      const maxOffset = Math.max(totalTracks - 50, 0);
      const randomOffset = Math.floor(Math.random() * (maxOffset / 50)) * 50;

      const tracksResponse = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
          offset: randomOffset, // Use the random offset here
        },
      });

      const uniqueAlbums: { [key: string]: any } = {};

      const albums =
        playlistId === "top"
          ? tracksResponse.data.items.map((item: any) => ({
              id: item.album.id,
              images: item.album.images,
              release_date: item.album.release_date,
              name: item.album.name,
              artists: item.album.artists,
              genres: item.album.genres,
            }))
          : tracksResponse.data.tracks.items.map((item: any) => ({
              id: item.track.album.id,
              images: item.track.album.images,
              release_date: item.track.album.release_date,
              name: item.track.album.name,
              artists: item.track.album.artists,
              genres: item.track.album.genres,
            }));

      albums.forEach((album: Album) => {
        if (!uniqueAlbums[album.id]) {
          uniqueAlbums[album.id] = album;
        }
      });

      const uniqueAlbumsArray = Object.values(uniqueAlbums);
      const shuffledAlbumsArray = uniqueAlbumsArray.sort(
        () => 0.5 - Math.random()
      );
      const selectedAlbums = shuffledAlbumsArray.slice(0, 3);

      const playlistName =
        playlistId === "top" ? "Your Top Songs" : response.data.name;

      navigate(`/guess-by-album-cover/${playlistId}`, {
        state: { albums: selectedAlbums, playlistName },
      });
    } catch (error) {
      console.error("Error fetching albums:", error);
      setError("Error fetching albums. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
      {imagesLoaded ? (
        <>
          <div className="absolute top-8 left-8">
            <Link
              to="/"
              className="flex items-center justify-center text-white bg-gray2 w-12 h-12 rounded-full hover:bg-neutral-800 transition-transform duration-200 ease-in-out transform hover:scale-110"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
          </div>
          <h2 className="text-4xl md:text-5xl mt-8">Select a playlist</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 max-w-4xl bg-gray2 p-8 rounded-2xl">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => fetchAlbums(playlist.id, playlist.url)}
                className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800 text-white text-xl flex items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out"
                style={{
                  backgroundImage: `url(${playlist.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "150px",
                  width: "150px",
                }}
              >
                <div className="absolute inset-0"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black opacity-0 hover:opacity-100 hover:bg-opacity-20 transition-all duration-300">
                  <p className="text-lg">{playlist.name}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <Loading></Loading>
      )}

      {loading && (
        <p className="text-gray-500 absolute bottom-12">Loading...</p>
      )}
      {error && <p className="text-red-500 absolute bottom-12">{error}</p>}
    </div>
  );
};

export default PlaylistSelection;
