import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Typography, Grid } from '@mui/material';
import axios from 'axios';

const ModelPredict = ({ API_ENDPOINT, model_uuid, model_data, metric_type }) => {
    const [inputValues, setInputValues] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [plotImage, setPlotImage] = useState(null);

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

    const handlePredict = async () => {
        setIsPredicting(true);
        setPlotImage(null);

        try {
            // Transform inputValues into the required JSON format for the backend
            const featureData = Object.keys(inputValues).reduce((acc, key) => {
                acc[key] = [inputValues[key]]; // Wrap each value in an array
                return acc;
            }, {});

            console.log('Making model prediction...');
            const response = await axios.post(`${API_ENDPOINT}predict`, {
                model_uuid: model_uuid,
                feature_data: featureData
            });

            if (response.data && response.data.prediction_probas && response.data.class_labels) {
                // Fetch the plot image
                const plotResponse = await axios.post(`${API_ENDPOINT}prediction-probas-bar`, {
                    prediction_probas: response.data.prediction_probas,
                    class_labels: response.data.class_labels
                }, { responseType: 'blob' }); // Ensure you get the response as a blob

                // Create a URL for the image
                const plotImageUrl = URL.createObjectURL(plotResponse.data);
                setPlotImage(plotImageUrl);
            }

            setPrediction(response.data);
            setIsPredicting(false);
        } catch (error) {
            console.error('Error during prediction:', error);
            setIsPredicting(false);

        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">Model Prediction</Typography>
            </Grid>
            <Grid item xs={12} container spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleRandomPitch}>
                        Choose Random Pitch
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handlePredict}>
                        Predict
                    </Button>
                </Grid>
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

            {isPredicting && (
                <Grid item xs={12}>
                    <Typography variant="subtitle1">Predicting...</Typography>
                </Grid>
            )}

            {!isPredicting && prediction && (
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {plotImage && (
                            <Grid item xs={10}>
                                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                                    <Typography variant="h6">Prediction Probabilities</Typography>
                                    <img src={plotImage} alt="Prediction Probabilities" style={{ maxWidth: '100%', height: 'auto' }} />
                                </Paper>
                            </Grid>
                        )}
                        <Grid item xs={2}>
                            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                                <Typography variant="h6">Prediction</Typography>
                                <Typography>{prediction.prediction}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

            )}

        </Grid>
    );
};

export default ModelPredict;
