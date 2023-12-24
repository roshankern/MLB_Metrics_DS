import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

function App() {
  const [playerData, setPlayerData] = useState({
    playerName: 'Miles Mikolas',
    playerId: null,
    generalMetrics: null,
    careerTimeline: null,
    specificMetrics: null
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Fetch Player ID
        const playerIdResponse = await axios.get(`${API_ENDPOINT}player-id`, {
          params: { last_name: 'Mikolas', first_name: 'Miles' }
        });
        const playerId = playerIdResponse.data.player_id;

        // Fetch General Metrics
        const generalMetricsResponse = await axios.get(`${API_ENDPOINT}player-general-metrics`, {
          params: { player_id: playerId }
        });
        const generalMetrics = generalMetricsResponse.data;

        // Fetch Career Timeline
        const careerTimelineResponse = await axios.post(`${API_ENDPOINT}player-career-timeline`, generalMetrics);
        const careerTimeline = careerTimelineResponse.data;

        // Fetch Specific Metrics
        const specificMetricsResponse = await axios.get(`${API_ENDPOINT}player-specific-metrics`, {
          params: {
            player_id: playerId,
            metric_type: 'pitching',
            start_dt: careerTimeline.start_dt,
            end_dt: careerTimeline.end_dt
          }
        });
        const specificMetrics = specificMetricsResponse.data;

        setPlayerData({
          playerName: 'Miles Mikolas',
          playerId,
          generalMetrics,
          careerTimeline,
          specificMetrics
        });
      } catch (error) {
        console.error('Failed to fetch player data:', error);
        // Handle error or set error state
      }
    };

    fetchPlayerData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Player Name: {playerData.playerName}</p>
        <p>Player ID: {playerData.playerId}</p>
        <p>Player General Metrics:</p>
        <pre>{JSON.stringify(playerData.generalMetrics, null, 2)}</pre>
        <p>Player Career Timeline:</p>
        <pre>{JSON.stringify(playerData.careerTimeline, null, 2)}</pre>
        <p>Player Specific Metrics (Pitching):</p>
        <pre>{JSON.stringify(playerData.specificMetrics, null, 2)}</pre>
      </header>
    </div>
  );
}

export default App;
