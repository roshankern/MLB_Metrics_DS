// src/hooks/usePlayerCareerTimeline.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usePlayerCareerTimeline = (generalMetrics, apiEndpoint) => {
    const [careerTimeline, setCareerTimeline] = useState('Loading...');

    useEffect(() => {
        if (generalMetrics && generalMetrics !== 'Loading...' && generalMetrics !== 'Error fetching general player metrics') {
            axios.post(`${apiEndpoint}player-career-timeline`, generalMetrics, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setCareerTimeline(JSON.stringify(response.data, null, 2));
                })
                .catch(error => {
                    console.error('There was an error fetching the player career timeline!', error);
                    setCareerTimeline('Error fetching career timeline');
                });
        }
    }, [generalMetrics, apiEndpoint]);

    return careerTimeline;
};

export default usePlayerCareerTimeline;
