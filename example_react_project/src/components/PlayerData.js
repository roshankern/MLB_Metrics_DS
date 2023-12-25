// PlayerData.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

function formattedCareerTimeline(careerTimeline) {
    return (
        <span>
            {careerTimeline.start_dt} <strong>-</strong> {careerTimeline.end_dt}
        </span>
    );
}

function parseGeneralMetrics(generalMetrics, metricType) {
    const { first_name, nickname, last_name, stats } = generalMetrics;
    const fullName = `${first_name} "${nickname}" ${last_name}`;

    let metricsInfo = fullName + '\n\n';

    const metricStats = stats.find(stat => stat.group === metricType);

    if (metricStats) {
        metricsInfo += `Career ${metricType.charAt(0).toUpperCase() + metricType.slice(1)}\n`;
        Object.keys(metricStats.stats).forEach(key => {
            metricsInfo += `${key}: ${metricStats.stats[key]}\n`;
        });
    }

    return metricsInfo;
}



const PlayerData = ({ searching, data }) => {
    if (searching) {
        return (
            <Typography variant="h5" component="h2">
                Loading...
            </Typography>
        );
    }

    if (data) {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6">Player ID</Typography>
                        <Typography>{data.playerId}</Typography>
                    </Paper>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6">Career Timeline</Typography>
                        <Typography>{formattedCareerTimeline(data.careerTimeline)}</Typography>
                    </Paper>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6">General Metrics</Typography>
                        <pre>{parseGeneralMetrics(data.generalMetrics, "pitching")}</pre>
                    </Paper>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Specific Metrics</Typography>
                        <Typography>{JSON.stringify(data.specificMetrics, null, 2)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Scatter Plot Box</Typography>
                        {/* Placeholder for scatter plot */}
                        <div>Scatter Plot Goes Here</div>
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    return null; // Render nothing if not searching and no data
};

export default PlayerData;
