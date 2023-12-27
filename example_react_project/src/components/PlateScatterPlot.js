import React from 'react';
import { Paper, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

const PlateScatterPlot = ({ plateCrossingMetrics, metricType }) => {
    const xColumn = "plate_x";
    const yColumn = "plate_z";
    const hueColumn = metricType === "pitching" ? "zone" : "description";

    // Define a function to map hue values to colors
    const getColor = (hueValue) => {
        // Define your color mapping logic here
        // For example, different colors for different zones or descriptions
        return 'rgba(75, 192, 192, 0.6)'; // Default color, modify as needed
    };

    // Prepare the data for the scatter plot
    const scatterData = plateCrossingMetrics.map(row => ({
        x: [row[xColumn]],
        y: [row[yColumn]],
        type: 'scatter',
        mode: 'markers',
        marker: { color: getColor(row[hueColumn]) }, // Function to determine color based on hueColumn
        name: row[hueColumn]
    }));


    return (
        <Paper style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6">Plate Crossing Scatter Plot</Typography>
            <Plot
                data={scatterData}
                layout={{
                    xaxis: { title: xColumn },
                    yaxis: { title: yColumn },
                    showlegend: true,
                    legend: { title: { text: hueColumn } }
                }}
            />
        </Paper>
    );
};

export default PlateScatterPlot;
