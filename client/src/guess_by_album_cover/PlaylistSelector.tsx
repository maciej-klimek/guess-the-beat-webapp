// PlaylistSelector.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Playlist {
  id: string;
  name: string;
}

interface PlaylistSelectorProps {
  accessToken: string;
  onSelectPlaylist: (playlistId: string) => void;
  onPlaylistsLoaded: (playlists: Playlist[]) => void;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({
  accessToken,
  onSelectPlaylist,
  onPlaylistsLoaded
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const fetchedPlaylists = response.data.items.map((playlist: any) => ({
          id: playlist.id,
          name: playlist.name,
        }));
        setPlaylists(fetchedPlaylists);
        onPlaylistsLoaded(fetchedPlaylists); 
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [accessToken, onPlaylistsLoaded]);

  return (
    <div className="mb-4 p-2 mt-2">
      <label htmlFor="playlistSelect" className="text-white mr-2">
        Select a Playlist:
      </label>
      <select
        id="playlistSelect"
        className="p-2 rounded"
        onChange={(e) => onSelectPlaylist(e.target.value)}
      >
        <option value="">Select a playlist</option>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlaylistSelector;
