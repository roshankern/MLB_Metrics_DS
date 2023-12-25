// App.js
import React, { useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';

import PlayerSearch from './components/PlayerSearch';
import PlayerData from './components/PlayerData';
import MLModels from './components/MLModels';

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
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <h2>Player Search:</h2>
        <PlayerSearch onSearchStarted={handleSearchStarted} onSearchComplete={handleSearchComplete} />
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <h2>Player Data:</h2>
        <PlayerData searching={searching} data={playerSearchData} />
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <h2>ML Models:</h2>
        <MLModels data={playerSearchData} />
      </Paper>


    </div>
  );
}

export default App;
