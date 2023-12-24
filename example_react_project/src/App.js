// src/App.js
import React from 'react';
import PlayerSearch from './components/PlayerSearch';

const App = () => {
  return (
    <div className="App">

      <h1>Player Search</h1>

      <header className="App-header">
        <PlayerSearch />
      </header>


    </div>
  );
}

export default App;
