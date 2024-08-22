import React from 'react';
import SongLibrary from '../components/SongLibrary';

function Home() {
  return (
    <div className="container mt-5">
      <h1>Welcome to the Music Player</h1>
      <SongLibrary />
    </div>
  );
}

export default Home;