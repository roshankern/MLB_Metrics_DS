import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [playerName, setPlayerName] = useState('Miles Mikolas');
  const [playerId, setPlayerId] = useState('Loading...');
  const [playerGeneralMetrics, setPlayerGeneralMetrics] = useState('Loading...');
  const [playerCareerTimeline, setPlayerCareerTimeline] = useState('Loading...');
  const [playerSpecificMetrics, setPlayerSpecificMetrics] = useState('Loading...');

  useEffect(() => {
    // Fetch Player ID
    axios.get('http://127.0.0.1:5000/api/v1/player-id', {
      params: {
        last_name: 'Mikolas',
        first_name: 'Miles'
      }
    })
      .then(response => {
        if (response.data.player_id) {
          setPlayerId(response.data.player_id);
          fetchPlayerGeneralMetrics(response.data.player_id);
          fetchPlayerCareerTimeline(response.data.player_id);
          fetchPlayerSpecificMetrics(response.data.player_id);
        }
      })
      .catch(error => {
        console.error('There was an error fetching player ID!', error);
        setPlayerId('Error fetching player ID');
      });
  }, []);

  const fetchPlayerGeneralMetrics = (playerId) => {
    axios.get(`http://127.0.0.1:5000/api/v1/player-general-metrics?player_id=${playerId}`)
      .then(response => {
        setPlayerGeneralMetrics(JSON.stringify(response.data, null, 2));
      })
      .catch(error => {
        console.error('There was an error fetching player general metrics!', error);
        setPlayerGeneralMetrics('Error fetching player general metrics');
      });
  };

  const fetchPlayerCareerTimeline = (playerId) => {
    axios.get(`http://127.0.0.1:5000/api/v1/player-career-timeline?player_id=${playerId}`)
      .then(response => {
        setPlayerCareerTimeline(JSON.stringify(response.data, null, 2));
      })
      .catch(error => {
        console.error('There was an error fetching player career timeline!', error);
        setPlayerCareerTimeline('Error fetching player career timeline');
      });
  };

  const fetchPlayerSpecificMetrics = (playerId) => {
    // Here you might want to define start and end dates, or modify the backend to handle defaults
    const startDate = '2022-01-01'; // Example start date
    const endDate = '2022-12-31'; // Example end date

    axios.get(`http://127.0.0.1:5000/api/v1/player-specific-metrics`, {
      params: {
        player_id: playerId,
        metric_type: 'pitching',
        start_dt: startDate,
        end_dt: endDate
      }
    })
      .then(response => {
        setPlayerSpecificMetrics(JSON.stringify(response.data, null, 2));
      })
      .catch(error => {
        console.error('There was an error fetching player specific metrics!', error);
        setPlayerSpecificMetrics('Error fetching player specific metrics');
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Player Name: {playerName}</p>
        <p>Player ID: {playerId}</p>
        <p>Player General Metrics:</p>
        <pre>{playerGeneralMetrics}</pre>
        <p>Player Career Timeline:</p>
        <pre>{playerCareerTimeline}</pre>
        <p>Player Specific Metrics (Pitching):</p>
        <pre>{playerSpecificMetrics}</pre>
      </header>
    </div>
  );
}

export default App;
