import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
import MusicPlayer from "../components/MusicPlayer"; 

function Playlists() {
  const { enqueueSnackbar } = useSnackbar();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null); 
  const getAuthToken = () => localStorage.getItem('token');

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://music-app-backend-fn92.onrender.com/playlists/getPlaylists',
        {
          headers: {
            authorization: `Bearer ${getAuthToken()}`,
          },
          timeout: 5000,
        }
      );
      setPlaylists(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        'You need to be logged in to view playlists. Please log in or sign up to continue.',
        { variant: 'error' }
      );
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
            authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setSongs(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch songs.', { variant: 'error' });
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
        { name: newPlaylistName },
        {
          headers: {
            authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      enqueueSnackbar('Playlist created successfully', { variant: 'success' });
      setNewPlaylistName('');
      fetchPlaylists();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to create playlist.', { variant: 'error' });
    }
  };

  const fetchPlaylistSongs = async (playlistId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://music-app-backend-fn92.onrender.com/playlists/${playlistId}/songs`,
        {
          headers: {
            authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setPlaylistSongs(response.data || []);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch songs for the playlist.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const addSongToPlaylist = async () => {
    try {
      if (!selectedPlaylistId || !selectedSongId) {
        enqueueSnackbar('Please select both a playlist and a song', { variant: 'warning' });
        return;
      }

      const isSongAlreadyInPlaylist = playlistSongs.some(
        (song) => song._id === selectedSongId
      );

      if (isSongAlreadyInPlaylist) {
        enqueueSnackbar('This song is already in the selected playlist.', {
          variant: 'info',
        });
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
            authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      enqueueSnackbar('Song added to playlist successfully', { variant: 'success' });
      fetchPlaylistSongs(selectedPlaylistId);
      setSelectedSongId('');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to add song to playlist.', { variant: 'error' });
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
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
              onChange={(e) => {
                setSelectedPlaylistId(e.target.value);
                setPlaylistSongs([]);
                if (e.target.value) {
                  fetchPlaylistSongs(e.target.value);
                }
              }}
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
              disabled={!selectedPlaylistId}
            >
              <option value="">Select Song</option>
              {songs.map((song) => (
                <option key={song._id} value={song._id}>
                  {song.title} - {song.artist}
                </option>
              ))}
            </select>

            <button
              className="btn btn-secondary mt-2"
              onClick={addSongToPlaylist}
              disabled={!selectedPlaylistId || !selectedSongId}
            >
              Add Song to Playlist
            </button>
          </div>

  
          <div className="mt-4">
            <h5>Your Playlists</h5>
            {playlists.length > 0 ? (
              <ul className="list-group">
                {playlists.map((playlist) => (
                  <li
                    key={playlist._id}
                    className={`list-group-item ${
                      selectedPlaylistId === playlist._id ? 'active' : ''
                    }`}
                    onClick={() => {
                      setSelectedPlaylistId(playlist._id);
                      fetchPlaylistSongs(playlist._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {playlist.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No playlists available. Create one above.</p>
            )}
          </div>

          {selectedPlaylistId && (
            <div className="mt-4">
              <h5>Songs in Selected Playlist</h5>
              {playlistSongs.length > 0 ? (
                <ul className="list-group">
                  {playlistSongs.map((song) => (
                    <li
                      key={song._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {song.title} - {song.artist}
                      </span>
                      <div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedSong(song)} 
                        >
                          Select
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No songs in this playlist. Add songs above.</p>
              )}
            </div>
          )}
          {selectedSong && <MusicPlayer song={selectedSong} />}
        </>
      )}
    </div>
  );
}

export default Playlists;