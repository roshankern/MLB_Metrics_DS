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

            console.log(`Searching for player ${lastName}, ${firstName}...`);

            console.log('Getting player ID...');
            const playerIdResponse = await axios.get(`${API_ENDPOINT}player-id`, {
                params: { first_name: firstName, last_name: lastName }
            });
            const playerId = playerIdResponse.data.player_id;

            console.log('Getting player general metrics...');
            const generalMetricsResponse = await axios.get(`${API_ENDPOINT}player-general-metrics`, {
                params: { player_id: playerId }
            });
            const playerGeneralMetrics = generalMetricsResponse.data;

            console.log('Getting player career timeline...');
            const careerTimelineResponse = await axios.post(`${API_ENDPOINT}player-career-timeline`, playerGeneralMetrics);
            const playerCareerTimeline = careerTimelineResponse.data;

            console.log('Getting player specific metrics...');
            const specificMetricsResponse = await axios.get(`${API_ENDPOINT}player-specific-metrics`, {
                params: { player_id: playerId, metric_type: metricType, start_dt: playerCareerTimeline["start_dt"], end_dt: playerCareerTimeline["end_dt"] }
            });
            const playerSpecificMetrics = specificMetricsResponse.data;

            console.log('Getting player plate crossing data...');
            const plateCrossingResponse = await axios.post(`${API_ENDPOINT}plate-crossing-metrics`, {
                player_metrics: playerSpecificMetrics,
                metric_type: metricType
            });
            const plateCrossingData = plateCrossingResponse.data;

            console.log('Getting player model data...');
            const modelDataResponse = await axios.post(`${API_ENDPOINT}model-data`, {
                player_metrics: playerSpecificMetrics,
                metric_type: metricType
            });
            const playerModelData = modelDataResponse.data;

            const playerData = {
                firstName: firstName,
                lastName: lastName,
                metricType: metricType,
                playerId: playerId,
                generalMetrics: playerGeneralMetrics,
                careerTimeline: playerCareerTimeline,
                specificMetrics: playerSpecificMetrics,
                plateCrossingMetrics: plateCrossingData,
                modelData: playerModelData
            };


            onSearchComplete(playerData);
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    };

    return (
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
    );
};

export default PlayerSearch;
