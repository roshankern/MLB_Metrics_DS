import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Typography, Grid } from '@mui/material';

const ModelPredict = ({ model_uuid, model_data, metric_type }) => {
    const [inputValues, setInputValues] = useState({});

    if (model_data && Object.keys(inputValues).length === 0) {
        const columnNames = Object.keys(model_data[0]).filter(name => name !== metric_type);
        setInputValues(columnNames.reduce((acc, name) => {
            acc[name] = '';
            return acc;
        }, {}));
    }

    if (!model_uuid || !model_data) return null;

    const targetColumn = metric_type === "pitching" ? "zone" : "description";
    const columnNames = Object.keys(model_data[0]).filter(name => name !== targetColumn);

    const handleInputChange = (name, value) => {
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleRandomPitch = () => {
        const randomRowIndex = Math.floor(Math.random() * model_data.length);
        const randomRow = model_data[randomRowIndex];
        setInputValues(columnNames.reduce((acc, name) => {
            acc[name] = randomRow[name];
            return acc;
        }, {}));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">Model Predict</Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleRandomPitch}>
                    Choose Random Pitch
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="prediction table">
                        <TableHead>
                            <TableRow>
                                {columnNames.map(name => (
                                    <TableCell key={name} align="center">
                                        {name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {columnNames.map(name => (
                                    <TableCell key={name} align="center">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={inputValues[name]}
                                            onChange={(e) => handleInputChange(name, e.target.value)}
                                            style={{ width: '100px' }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default ModelPredict;
