import React, { useState, useRef } from 'react';
import "./MusicPlayer.css"
function MusicPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="music-player">
      <h5>Now Playing: {song.title} - {song.artist}</h5>
      <div className='play'>
      <audio
        ref={audioRef}
        src={song.url}
        onEnded={() => setIsPlaying(true)}
        controls={true} 
      />
      <div>
        {isPlaying ? (
          <button className="btn btn-primary" onClick={handlePause}>
            Pause
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handlePlay}>
            Play
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;