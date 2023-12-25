// PlayerData.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function createMetricsTable(metricsJson) {
    const firstTenRows = metricsJson.slice(0, 5);
    const totalRows = metricsJson.length;

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {Object.keys(firstTenRows[0]).map((key) => (
                                <TableCell key={key} align="center">{key}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {firstTenRows.map((row, index) => (
                            <TableRow key={index}>
                                {Object.values(row).map((value, cellIndex) => (
                                    <TableCell key={cellIndex} align="center">{value}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <p>Total Rows: {totalRows}</p>
        </div>
    );
}

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

    const metricStats = stats.find(stat => stat.group === (metricType === "pitching" ? "pitching" : "hitting"));

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
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
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
                            <pre>{parseGeneralMetrics(data.generalMetrics, data.metricType)}</pre>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} style={{ padding: '16px' }}>
                            <Typography variant="h6">Scatter Plot Box</Typography>
                            {/* Placeholder for scatter plot */}
                            <div>Scatter Plot Goes Here</div>
                        </Paper>
                    </Grid>
                </Grid>
                <Paper elevation={3} style={{ padding: '16px' }}>
                    <Typography variant="h6">Specific Metrics</Typography>
                    <div>
                        {createMetricsTable(data.specificMetrics)}
                    </div>
                </Paper>
            </div>

        );
    }

    return null; // Render nothing if not searching and no data
};

export default PlayerData;
