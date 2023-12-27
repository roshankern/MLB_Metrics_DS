import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';

const PlateScatterPlot = ({ plateCrossingMetrics, metricType }) => {
    const [plotUrl, setPlotUrl] = useState('');

    useEffect(() => {
        // Function to fetch plot
        const fetchPlot = async () => {
            try {
                console.log('Getting plate crossing scatter plot...');
                const response = await axios.post('http://127.0.0.1:5000/api/v1/generate-plot', {
                    player_metrics: plateCrossingMetrics,
                    metric_type: metricType
                }, { responseType: 'blob' });

                // Create a local URL for the response image
                const url = URL.createObjectURL(new Blob([response.data]));
                setPlotUrl(url);
            } catch (error) {
                console.error('Error fetching plot:', error);
            }
        };

        if (plateCrossingMetrics && metricType) {
            fetchPlot();
        }
    }, [plateCrossingMetrics, metricType]);

    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6">Plate Crossing Scatter Plot</Typography>
            <div style={{ textAlign: 'center' }}>
                {plotUrl ? (
                    <img src={plotUrl} alt="Scatter Plot" style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                    <p>Loading plot...</p>
                )}
            </div>
        </Paper>
    );
};

export default PlateScatterPlot;
