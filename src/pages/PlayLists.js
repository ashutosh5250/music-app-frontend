import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';

function Playlists() {
  const { enqueueSnackbar } = useSnackbar();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };
console.log(getAuthToken());
  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://music-app-backend-fn92.onrender.com/playlists/getPlaylists',
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, 
          },
          timeout: 5000,
        }
      );
      setPlaylists(response.data);
    } catch (error) {
      console.log(error)
      enqueueSnackbar("You need to be logged in to create a playlist. Please log in or sign up to continue", { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSongs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://music-app-backend-fn92.onrender.com/song/getSong',
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, 
          },
        }
      );
      setSongs(response.data);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async () => {
    try {
      if (newPlaylistName.trim() === '') {
        enqueueSnackbar('Playlist name cannot be empty', { variant: 'warning' });
        return;
      }

      await axios.post(
        'https://music-app-backend-fn92.onrender.com/playlists/createPlaylist',
        {
          name: newPlaylistName,
        },
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, 
            'Content-Type': 'application/json',
          },
        }
      );
      enqueueSnackbar('Playlist created successfully', { variant: 'success' });
      setNewPlaylistName('');
      fetchPlaylists();
    } catch (error) {
      enqueueSnackbar(error);
    }
  };

  const addSongToPlaylist = async () => {
    try {
      if (!selectedPlaylistId || !selectedSongId) {
        enqueueSnackbar('Please select both a playlist and a song', { variant: 'warning' });
        return;
      }

      await axios.post(
        'https://music-app-backend-fn92.onrender.com/playlists/add_songs',
        {
          playlistId: selectedPlaylistId,
          songId: selectedSongId,
        },
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, 
            'Content-Type': 'application/json',
          },
        }
      );
      enqueueSnackbar('Song added to playlist successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Your Playlists</h2>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="New Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={createPlaylist}>
              Create Playlist
            </button>
          </div>

          <div className="form-group mt-4">
            <select
              className="form-control"
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
            >
              <option value="">Select Playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))}
            </select>

            <select
              className="form-control mt-2"
              value={selectedSongId}
              onChange={(e) => setSelectedSongId(e.target.value)}
            >
              <option value="">Select Song</option>
              {songs.map((song) => (
                <option key={song._id} value={song._id}>
                  {song.title} - {song.artist}
                </option>
              ))}
            </select>

            <button className="btn btn-secondary mt-2" onClick={addSongToPlaylist}>
              Add Song to Playlist
            </button>
          </div>

          <ul className="list-group mt-4">
            {playlists.map((playlist) => (
              <li key={playlist._id} className="list-group-item">
                {playlist.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Playlists;