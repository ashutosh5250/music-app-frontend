import React from 'react';
import SongLibrary from '../components/SongLibrary';
import "./Home.css"
function Home() {
  return (
    <div className="container">
      <div className='heading'>
      <h3 className='mb-2 modal-title fs-1'>Welcome to the Music Player</h3>
      </div>
      <SongLibrary />
    </div>
  );
}

export default Home;