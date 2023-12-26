import React, { useState, useEffect } from 'react';
import { Paper, Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';

import ModelPredict from './ModelPredict';

const MLModels = ({ data }) => {
    const [modelType, setModelType] = useState('');
    const [isTraining, setIsTraining] = useState(0);
    const [modelDataResponse, setModelDataResponse] = useState(null);
    const [trainResponse, setTrainResponse] = useState(null);

    const handleModelTypeChange = (event) => {
        setModelType(event.target.value);
    };

    const handleTrain = async () => {
        setIsTraining(1);
        const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

        try {
            console.log('Training model with Flask backend...');

            // get model data
            const modelDataResponse = await axios.post(`${API_ENDPOINT}model-data`, {
                player_metrics: data.specificMetrics,
                metric_type: data.metricType
            });
            setModelDataResponse(modelDataResponse.data);


            const modelTrainingResponse = await axios.post(`${API_ENDPOINT}tested-model`, {
                model_data: modelDataResponse.data,
                target: data.metricType === "pitching" ? "zone" : "description",
                model_type: modelType
            });

            setTrainResponse(modelTrainingResponse.data);
            setIsTraining(2);
        } catch (error) {
            console.error('Error during model training:', error);
            setIsTraining(2);
        }
    };

    useEffect(() => {
        if (!data) {
            setModelType("");
            setIsTraining(0);
        }
    }, [data]);


    if (!data) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="model-type-label">Model Type</InputLabel>
                    <Select
                        labelId="model-type-label"
                        id="model-type"
                        value={modelType}
                        label="Model Type"
                        onChange={handleModelTypeChange}
                    >
                        <MenuItem value="logistic_regression">Logistic Regression</MenuItem>
                        <MenuItem value="random_forest">Random Forest</MenuItem>
                        <MenuItem value="gradient_boosting">Gradient Boosting</MenuItem>
                        <MenuItem value="hist_gradient_boosting">Histogram Gradient Boosting</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleTrain}>
                    Train
                </Button>
            </Grid>

            {isTraining === 1 && (
                <Grid item xs={12}>
                    <Typography variant="h6">Training...</Typography>
                </Grid>
            )}

            {isTraining === 2 && trainResponse && (
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                                <Typography variant="h6">Model Accuracy</Typography>
                                <Typography>{trainResponse.accuracy}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                                <Typography variant="h6">Model UUID</Typography>
                                <Typography>{trainResponse.model_uuid}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                                <ModelPredict
                                    model_uuid={trainResponse.model_uuid}
                                    model_data={modelDataResponse}
                                    metric_type={data.metricType}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default MLModels;
