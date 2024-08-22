import React, { useEffect, useState } from 'react';
import { CircularProgress } from "@mui/material";
import MusicPlayer from './MusicPlayer';
import axios from 'axios';
import { useSnackbar } from "notistack";

function SongLibrary() {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://music-app-backend-fn92.onrender.com/song/getSong');
      setSongs(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching songs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div>
      <h2>Song Library</h2>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {songs.length === 0 ? (
            <p>No songs available</p>
          ) : (
            <ul className="list-group">
              {songs.map((song) => (
                <li key={song._id} className="list-group-item d-flex justify-content-between align-items-center">
                  {song.title} - {song.artist}
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedSong(song)}>Play</button>
                </li>
              ))}
            </ul>
          )}
          {selectedSong && <MusicPlayer song={selectedSong} />}
        </>
      )}
    </div>
  );
}

export default SongLibrary;