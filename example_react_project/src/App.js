// App.js
import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';

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
        <Typography variant="h4" style={{ marginBottom: '16px' }}>Player Search:</Typography>
        <PlayerSearch onSearchStarted={handleSearchStarted} onSearchComplete={handleSearchComplete} />
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h4" style={{ marginBottom: '16px' }}>Player Data:</Typography>
        <PlayerData searching={searching} data={playerSearchData} />
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h4" style={{ marginBottom: '16px' }}>
          ML Models:
        </Typography>
        <MLModels data={playerSearchData} />
      </Paper>


    </div>
  );
}

export default App;
