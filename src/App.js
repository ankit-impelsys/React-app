import React, { useState } from 'react';
import './App.css';

function App() {
  // State to hold the value of the textbox
  const [textBoxValue, setTextBoxValue] = useState('');
  // State to hold the data received from the API
  const [userData, setUserData] = useState(null);
  // State to manage loading state
  const [loading, setLoading] = useState(false);
  // State to manage error state
  const [error, setError] = useState(null);

  // Function to handle button click
  const handleButtonClick = async () => {
    try {
      // Reset previous states
      setUserData(null);
      setError(null);
      setLoading(true);

      // Make API request
      const response = await fetch(`http://localhost:8080/userStats/${textBoxValue}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      // Update the state with the received data
      setUserData(data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error fetching user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Textbox */}
        <input
          type="number" 
          value={textBoxValue}
          onChange={(e) => setTextBoxValue(e.target.value)}
          placeholder="Enter USER-ID here"
        />

        {/* Button */}
        <button onClick={handleButtonClick}>Get Details</button>

        {/* Display Data or Error */}
        {loading && <p>Loading...</p>}
        {userData && (
          <div>
            <p>Product ID: {userData.product_id}</p>
            <p>Time Taken: {userData.time_taken} seconds</p>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
    </div>
  );
}

export default App;


