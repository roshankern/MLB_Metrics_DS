import React from 'react';
import { Paper, Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const ModelTraining = ({ modelType, setModelType, isTraining, setIsTraining, trainResponse, handleTrain }) => {
    const handleModelTypeChange = (event) => {
        setModelType(event.target.value);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">Model Training</Typography>
            </Grid>

            {/* Training Button */}
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleTrain}>
                    Train
                </Button>
            </Grid>

            {/* Model Type Dropdown */}
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
                        <MenuItem value="svc">Support Vector Classification</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Training Status */}
            {isTraining === 1 && (
                <Grid item xs={12}>
                    <Typography variant="h6">Training...</Typography>
                </Grid>
            )}

            {/* Training Results */}
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
                </Grid>
            )}
        </Grid>
    );
};

export default ModelTraining;
