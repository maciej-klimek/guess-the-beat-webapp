import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
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
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [error, setError] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [submittedPlaylist, setSubmittedPlaylist] = useState<Playlist | null>(
    null
  );
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

  const fetchTracks = async (playlistId: string, url: string) => {
    setLoading(true);
    try {
      // Get the total number of tracks in the playlist
      const playlistResponse = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const totalTracks = playlistId === "top" ? playlistResponse.data.total : playlistResponse.data.tracks.total;

      // Calculate random offset (must be a multiple of 50, and within the total track count)
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

      const tracks =
        playlistId === "top"
          ? tracksResponse.data.items
          : tracksResponse.data.tracks.items.map((item: any) => item.track);

      const playlistName = playlistId === "top" ? "Your Top Songs" : playlistResponse.data.name;


      console.log(tracks);

      navigate(`/guess-by-listening/${playlistId}`, {
        state: { tracks, playlistName },
      });
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setError("Error fetching tracks. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistInfo = async (url: string) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const playlistId = response.data.id;
      const playlistName = response.data.name;
      const playlistImageUrl =
        response.data.images.length > 0 ? response.data.images[0].url : "";

      const fetchedPlaylist: Playlist = {
        id: playlistId,
        name: playlistName,
        url: url,
        imageUrl: playlistImageUrl,
      };

      setSubmittedPlaylist(fetchedPlaylist);
      setError("");
    } catch (error) {
      console.error("Error fetching playlist info:", error);
      setError(
        "Error fetching playlist info. Please check the URL and try again."
      );
      setSubmittedPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPlaylistUrl(url);

    if (url) {
      const playlistId = extractPlaylistIdFromUrl(url);
      if (playlistId) {
        const playlistApiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
        await fetchPlaylistInfo(playlistApiUrl);
      } else {
        setError("Invalid Spotify playlist URL.");
        setSubmittedPlaylist(null);
      }
    }
  };

  const extractPlaylistIdFromUrl = (url: string): string | null => {
    const regex =
      /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)\??.*$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray1 text-green-500 text-center">
      {!imagesLoaded ? (
        <Loading></Loading>
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center text-green-500 text-center bg-gray1 poppins-semibold p-4">
          <div className="absolute top-8 right-8">
            <Link
              to="/"
              className="flex items-center justify-center text-white bg-gray2 w-12 h-12 rounded-full hover:bg-neutral-800 transition-transform duration-200 ease-in-out transform hover:scale-110"
            >
              <FaArrowRight className="text-xl" />
            </Link>
          </div>
          <h2 className="text-4xl md:text-5xl mt-8 mb-4">Select a playlist</h2>

          <div className="flex justify-center gap-8 mt-12 max-w-4xl">
            <div className="bg-gray2 p-8 rounded-xl flex flex-col gap-8">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => fetchTracks(playlist.id, playlist.url)}
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

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-neutral-500 text-2xl">Or</h1>
            </div>

            <div className="bg-gray2 p-8 rounded-xl flex flex-col items-center">
              <form className="flex items-center mb-4">
                <input
                  type="text"
                  value={playlistUrl}
                  onChange={handlePaste}
                  onKeyPress={(e) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  placeholder="Paste Spotify playlist URL"
                  className="px-4 py-2 rounded-md bg-gray3 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
                />
              </form>
              {submittedPlaylist ? (
                <div
                  className="mt-20 relative overflow-hidden rounded-lg text-white text-xl flex items-center justify-between transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  onClick={() =>
                    fetchTracks(submittedPlaylist.id, submittedPlaylist.url)
                  }
                  style={{
                    backgroundImage: `url(${submittedPlaylist.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "250px",
                    width: "250px",
                  }}
                >
                  <div className="absolute inset-0"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black opacity-0 hover:opacity-100 hover:bg-opacity-20 transition-all duration-300">
                    <p className="text-lg">{submittedPlaylist.name}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-20 w-60 h-60 bg-gray3 rounded-lg text-neutral-500 text-6xl flex justify-center items-center">
                  ?
                </div>
              )}
            </div>
          </div>

          {loading && (
            <p className="text-gray-500 absolute bottom-12">Loading...</p>
          )}
          {error && <p className="text-red-500 absolute bottom-12">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default PlaylistSelection;
