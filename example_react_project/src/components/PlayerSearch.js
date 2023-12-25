import React, { useState } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Grid } from '@mui/material';

const PlayerSearch = ({ onSearchStarted, onSearchComplete }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [metricType, setMetricType] = useState('pitching'); // Default to pitcher

    const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

    const handleSubmit = async (e) => {

        e.preventDefault();
        onSearchStarted();

        try {
            console.log('Making API calls to Flask backend...');

            // Make an API calls to Flask backend
            const playerIdResponse = await axios.get(`${API_ENDPOINT}player-id`, {
                params: { first_name: firstName, last_name: lastName }
            });
            const playerId = playerIdResponse.data.player_id;

            const generalMetricsResponse = await axios.get(`${API_ENDPOINT}player-general-metrics`, {
                params: { player_id: playerId }
            });
            const playerGeneralMetrics = generalMetricsResponse.data;

            const careerTimelineResponse = await axios.post(`${API_ENDPOINT}player-career-timeline`, playerGeneralMetrics);
            const playerCareerTimeline = careerTimelineResponse.data;

            const specificMetricsResponse = await axios.get(`${API_ENDPOINT}player-specific-metrics`, {
                params: { player_id: playerId, metric_type: metricType, start_dt: playerCareerTimeline["start_dt"], end_dt: playerCareerTimeline["end_dt"] }
            });
            const playerSpecificMetrics = specificMetricsResponse.data;

            const playerData = {
                firstName: firstName,
                lastName: lastName,
                metricType: metricType,
                playerId: playerId,
                generalMetrics: playerGeneralMetrics,
                careerTimeline: playerCareerTimeline,
                specificMetrics: playerSpecificMetrics
            };

            // Call the onSearchComplete function passed as prop with the response data
            console.log('Player data:', playerData)
            onSearchComplete(playerData);
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    };

    return (
        <Paper style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="metric-type-label">Stat Type</InputLabel>
                            <Select
                                labelId="metric-type-label"
                                value={metricType}
                                label="Stat Type"
                                onChange={(e) => setMetricType(e.target.value)}
                            >
                                <MenuItem value="pitching">Pitching</MenuItem>
                                <MenuItem value="batting">Batting</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default PlayerSearch;
