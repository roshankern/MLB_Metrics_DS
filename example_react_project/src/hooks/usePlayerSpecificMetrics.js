// src/hooks/usePlayerSpecificMetrics.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlayerSpecificMetrics = (playerId, metricType, startDate, endDate, apiEndpoint) => {
    const [specificMetrics, setSpecificMetrics] = useState('Loading...');

    useEffect(() => {
        if (playerId && startDate && endDate && playerId !== 'Loading...' && startDate !== 'Loading...' && endDate !== 'Loading...') {
            axios.get(`${apiEndpoint}player-specific-metrics`, {
                params: {
                    player_id: playerId,
                    metric_type: metricType,
                    start_dt: startDate,
                    end_dt: endDate
                }
            })
                .then(response => {
                    setSpecificMetrics(JSON.stringify(response.data, null, 2));
                })
                .catch(error => {
                    console.error('There was an error fetching the player specific metrics!', error);
                    setSpecificMetrics('Error fetching specific metrics');
                });
        }
    }, [playerId, metricType, startDate, endDate, apiEndpoint]);

    return specificMetrics;
};

export default usePlayerSpecificMetrics;
