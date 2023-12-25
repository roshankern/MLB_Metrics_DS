import React, { useState } from 'react';
import { Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const MLModels = ({ data }) => {
    const [modelType, setModelType] = useState('');
    const [isTraining, setIsTraining] = useState(false);

    const handleModelTypeChange = (event) => {
        setModelType(event.target.value);
    };

    const handleTrain = () => {
        setIsTraining(true);
        console.log(`Training model type: ${modelType}`);
        // Add the actual training logic here
    };

    if (!data) {
        return null; // Return nothing if there's no data
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
                </>
            )}
        </Grid>
    );
};

export default MLModels;
