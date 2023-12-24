// App.js
import React, { useState } from 'react';
import PlayerSearch from './components/PlayerSearch';
import PlayerData from './components/PlayerData';

function App() {
  const [searching, setSearching] = useState(false);
  const [playerSearchData, setPlayerSearchData] = useState(null);

  const handleSearchStarted = () => {
    setSearching(true);
    setPlayerSearchData(null); // Reset the player data
  };

  const handleSearchComplete = (data) => {
    setSearching(false);
    setPlayerSearchData(data);
  };

  return (
    <div className="App">
      <PlayerSearch onSearchStarted={handleSearchStarted} onSearchComplete={handleSearchComplete} />
      <PlayerData searching={searching} data={playerSearchData} />
    </div>
  );
}

export default App;
