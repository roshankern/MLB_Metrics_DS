import React, { useState } from 'react';
import axios from 'axios';

const PlayerSearch = ({ onSearchComplete }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [statType, setStatType] = useState('pitcher'); // Default to pitcher

    const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make an API call to your Flask backend
            const response = await axios.get(`${API_ENDPOINT}player-id`, {
                params: { first_name: firstName, last_name: lastName, stat_type: statType }
            });
            // Call the onSearchComplete function passed as prop with the response data
            onSearchComplete(response.data);
        } catch (error) {
            console.error('Error fetching player data:', error);
            // Handle errors here (e.g., show an alert or notification)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label>Stat Type:</label>
                <select value={statType} onChange={(e) => setStatType(e.target.value)}>
                    <option value="pitcher">Pitcher</option>
                    <option value="batter">Batter</option>
                </select>
            </div>
            <button type="submit">Search</button>
        </form>
    );
};

export default PlayerSearch;
