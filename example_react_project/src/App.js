// App.js
import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';

import PlayerSearch from './components/PlayerSearch';
import PlayerData from './components/PlayerData';
import MLModels from './components/MLModels';

function App() {
  const API_URL = "http://127.0.0.1:5000";
  const API_NAME = `mlb-metrics-api`;
  const API_VERSION = "v1";
  const API_ENDPOINT = `${API_URL}/${API_NAME}/${API_VERSION}/`;

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
        <PlayerSearch API_ENDPOINT={API_ENDPOINT} onSearchStarted={handleSearchStarted} onSearchComplete={handleSearchComplete} />
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h4" style={{ marginBottom: '16px' }}>Player Data:</Typography>
        <PlayerData API_ENDPOINT={API_ENDPOINT} searching={searching} data={playerSearchData} />
      </Paper>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h4" style={{ marginBottom: '16px' }}>
          ML Models:
        </Typography>
        <MLModels API_ENDPOINT={API_ENDPOINT} searching={searching} data={playerSearchData} />
      </Paper>


    </div>
  );
}

export default App;
