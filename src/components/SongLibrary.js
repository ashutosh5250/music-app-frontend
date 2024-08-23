import React, { useEffect, useState } from 'react';
import { CircularProgress, Button } from "@mui/material";
import MusicPlayer from './MusicPlayer';
import axios from 'axios';
import { useSnackbar } from "notistack";

function SongLibrary() {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 7; 
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://music-app-backend-fn92.onrender.com/song/getSong', {
        headers: {
          'authorization': `Bearer ${getAuthToken()}`
        },
        timeout: 5000,
      });
      setSongs(response.data);
    } catch (error) {
      enqueueSnackbar(
        "You need to be logged in to play song. Please log in or sign up to continue",
        { variant: 'error' })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(songs.length / songsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {songs.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <p>No songs available</p>
            </div>
          ) : (
            <>
              <ul className="list-group">
                {currentSongs.map((song) => (
                  <li key={song._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {song.title} - {song.artist}
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedSong(song)}>Select Song</button>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(songs.length / songsPerPage)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {selectedSong && <MusicPlayer song={selectedSong} />}
        </>
      )}
    </div>
  );
}

export default SongLibrary;