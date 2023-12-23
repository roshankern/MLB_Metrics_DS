import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    // Replace with your Flask server URL and the correct endpoint
    axios.get('http://127.0.0.1:5000/api/v1/player-id', {
      params: {
        last_name: 'Mikolas',
        first_name: 'Miles'
      }
    })
      .then(response => {
        if (response.data.player_id) {
          setPlayerId(response.data.player_id);
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {playerId ? <p>Player ID: {playerId}</p> : <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
