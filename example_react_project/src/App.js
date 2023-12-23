// App.js
import React from 'react';
import usePlayerId from './hooks/usePlayerId';
import usePlayerGeneralMetrics from './hooks/usePlayerGeneralMetrics';

const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

function App() {
  const lastName = 'Mikolas';
  const firstName = 'Miles';

  const playerName = `${lastName} ${firstName}`;
  const playerId = usePlayerId(lastName, firstName, API_ENDPOINT);
  const playerGeneralMetrics = usePlayerGeneralMetrics(playerId, API_ENDPOINT);

  return (
    <div className="App">
      <header className="App-header">
        <p>Player Name: {playerName}</p>
        <p>Player ID: {playerId !== 'Loading...' && playerId}</p>
        <p>Player General Metrics:</p>
        <pre>{playerGeneralMetrics !== 'Loading...' && playerGeneralMetrics}</pre>
      </header>
    </div>
  );
}

export default App;
