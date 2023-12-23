// src/hooks/usePlayerGeneralMetrics.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlayerGeneralMetrics = (playerId, apiEndpoint) => {
    const [generalMetrics, setGeneralMetrics] = useState('Loading...');

    useEffect(() => {
        if (playerId && playerId !== 'Loading...' && playerId !== 'Error fetching player ID') {
            axios.get(`${apiEndpoint}player-general-metrics`, {
                params: { player_id: playerId }
            })
                .then(response => {
                    setGeneralMetrics(JSON.stringify(response.data, null, 2));
                })
                .catch(error => {
                    console.error('There was an error fetching general player metrics!', error);
                    setGeneralMetrics('Error fetching general player metrics');
                });
        }
    }, [playerId, apiEndpoint]);

    return generalMetrics;
};

export default usePlayerGeneralMetrics;
