// src/components/PlayerSearch.js
import React, { useState } from 'react';
import axios from 'axios';

const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

const PlayerSearch = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [careerTimeline, setCareerTimeline] = useState(null);
    const [error, setError] = useState('');

    const fetchCareerTimeline = async (generalMetrics) => {
        try {
            const response = await axios.post(`${API_ENDPOINT}player-career-timeline`, generalMetrics);
            setCareerTimeline(response.data);
        } catch (err) {
            setError('Error fetching career timeline');
            setCareerTimeline(null);
        }
    };

    const fetchGeneralMetrics = async (id) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}player-general-metrics`, {
                params: { player_id: id }
            });
            await fetchCareerTimeline(response.data);
        } catch (err) {
            setError('Error fetching general metrics');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setCareerTimeline(null);
        try {
            const response = await axios.get(`${API_ENDPOINT}player-id`, {
                params: { last_name: lastName, first_name: firstName }
            });
            const playerId = response.data.player_id;
            setPlayerId(playerId);
            await fetchGeneralMetrics(playerId);
        } catch (err) {
            setError('Error finding player ID');
            setPlayerId('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <h3>Player ID:</h3>
            {playerId && <p>{playerId}</p>}
            <h3>Player Career Timeline:</h3>
            {careerTimeline && <p>{careerTimeline.start_dt} - {careerTimeline.end_dt || 'Present'}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default PlayerSearch;
