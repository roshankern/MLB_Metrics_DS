// src/hooks/usePlayerId.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlayerId = (lastName, firstName, apiEndpoint) => {
    const [playerId, setPlayerId] = useState('Loading...');

    useEffect(() => {
        axios.get(`${apiEndpoint}player-id`, {
            params: { last_name: lastName, first_name: firstName }
        })
            .then(response => {
                if (response.data.player_id) {
                    setPlayerId(response.data.player_id);
                }
            })
            .catch(error => {
                console.error('There was an error fetching player ID!', error);
                setPlayerId('Error fetching player ID');
            });
    }, [firstName, lastName, apiEndpoint]);

    return playerId;
};

export default usePlayerId;
