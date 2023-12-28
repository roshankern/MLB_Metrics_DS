import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const ModelSchema = ({ data }) => {
    if (!data) {
        return null;
    }

    const targetColumn = data.metricType === "pitching" ? "zone" : "description";
    const uniqueTargets = Array.from(new Set(data.modelData.map(item => item[targetColumn])));
    const featureColumns = Object.keys(data.modelData[0] || {}).filter(name => name !== targetColumn);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">Model Schema</Typography>
            </Grid>

            {/* Feature Columns Table */}
            <Grid item xs={6}>
                <Typography variant="h6">Feature columns for {data.metricType}</Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="feature columns">
                        <TableBody>
                            <TableRow>
                                {featureColumns.map(name => (
                                    <TableCell key={name} align="center">{name}</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            {/* Target Column Table */}
            <Grid item xs={6}>
                <Typography variant="h6">Classes for {targetColumn}</Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="target column">
                        <TableBody>
                            <TableRow>
                                {uniqueTargets.map(name => (
                                    <TableCell key={name} align="center">{name}</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default ModelSchema;
