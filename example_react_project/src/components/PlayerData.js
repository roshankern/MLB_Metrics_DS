// PlayerData.js
import React from 'react';

const PlayerData = ({ searching, data }) => {
    if (searching) {
        return <div>Loading...</div>;
    }

    if (data) {
        return (
            <div>
                <h2>Player Data:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    }

    return null; // Render nothing if not searching and no data
};

export default PlayerData;
