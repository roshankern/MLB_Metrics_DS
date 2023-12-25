import React, { useState } from 'react';
import { Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';

const MLModels = ({ data }) => {
    const [modelType, setModelType] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [trainResponse, setTrainResponse] = useState(null);

    const handleModelTypeChange = (event) => {
        setModelType(event.target.value);
    };

    const handleTrain = async () => {
        setIsTraining(true);
        const API_ENDPOINT = "http://127.0.0.1:5000/api/v1/";

        try {
            const dataFunction = "tested-model"

            // get model data
            const modelDataResponse = await axios.post(API_ENDPOINT, {
                player_metrics: data.specificMetrics,
                target: data.metricType === "pitching" ? "zone" : "description",
                model_type: modelType
            });

            const modelTrainingResponse = await axios.post(`${API_ENDPOINT}tested-model`, {
                player_metrics: data.specificMetrics,
                target: data.metricType === "pitching" ? "zone" : "description",
                model_type: modelType
            });

            setTrainResponse(modelTrainingResponse.data);
            setIsTraining(false);
        } catch (error) {
            console.error('Error during model training:', error);
            setIsTraining(false);
        }
    };

    if (!data) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            {!isTraining ? (
                <>
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
                </>
            ) : (
                <>
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
                    <Grid item xs={12}>
                        <Typography variant="h6">Training...</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {trainResponse && (
                            <div>
                                <Typography variant="subtitle1">Model UUID: {trainResponse.model_uuid}</Typography>
                                <Typography variant="subtitle1">Accuracy: {trainResponse.accuracy}</Typography>
                            </div>
                        )}
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default MLModels;
