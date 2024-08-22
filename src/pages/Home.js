import React from 'react';
import SongLibrary from '../components/SongLibrary';
import "./Home.css"
function Home() {
  return (
    <div className="container mt-5 mb-5">
      <div className='heading'>
      <h1 className='mb-5 modal-title fs-1'>Welcome to the Music Player</h1>
      </div>
      <SongLibrary />
    </div>
  );
}

export default Home;