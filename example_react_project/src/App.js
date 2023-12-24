import React, { useState } from 'react';
import PlayerSearch from './components/PlayerSearch'; // Adjust the path as needed

function App() {
  const [playerSearchData, setPlayerSearchData] = useState(null);

  const handleSearchComplete = (data) => {
    setPlayerSearchData(data);
    // You can now use playerData to render additional components or pass data to other components
  };

  return (
    <div className="App">
      <PlayerSearch onSearchComplete={handleSearchComplete} />
      {/* Render other components conditionally based on playerData */}
    </div>
  );
}

export default App;
