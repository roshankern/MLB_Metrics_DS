import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography } from '@mui/material';
import axios from 'axios';

import ModelSchema from './ModelSchema';
import ModelTraining from './ModelTraining';
import ModelPredict from './ModelPredict';

const MLModels = ({ API_ENDPOINT, searching, data }) => {
    const [modelType, setModelType] = useState('');
    const [isTraining, setIsTraining] = useState(0);
    const [trainResponse, setTrainResponse] = useState(null);

    const handleTrain = async () => {
        setIsTraining(1);

        try {
            console.log('Training model...');

            const modelTrainingResponse = await axios.post(`${API_ENDPOINT}tested-model`, {
                model_data: data.modelData,
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

    if (searching) {
        return (
            <Typography variant="h5" component="h2">
                Loading...
            </Typography>
        );
    }


    if (!data) {
        return null
    }


    return (

        <Grid container spacing={2}>
            {/* Use Model Schema Component */}
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <ModelSchema data={data} />
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <ModelTraining
                        modelType={modelType}
                        setModelType={setModelType}
                        isTraining={isTraining}
                        setIsTraining={setIsTraining}
                        trainResponse={trainResponse}
                        handleTrain={handleTrain}
                    />
                </Paper>
            </Grid>



            {/* Training Results and Model Predict Component */}
            {isTraining === 2 && trainResponse && (
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                                <ModelPredict
                                    API_ENDPOINT={API_ENDPOINT}
                                    model_uuid={trainResponse.model_uuid}
                                    model_data={data.modelData}
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
