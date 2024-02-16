import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState('');

  useEffect(() => {
    fetchData();
  }, [userID]);

  const fetchData = () => {
    if (userID) {
      fetch(`http://localhost:8080/data?user_id=${userID}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }
  };

  const handleUserIDChange = (event) => {
    setUserID(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Basic React App!</h1>
        <p>This is the home page.</p>
        <div>
          <label htmlFor="user_id">User ID: </label>
          <input type="text" id="user_id" value={userID} onChange={handleUserIDChange} />
          <button onClick={fetchData}>Fetch Data</button>
        </div>
        <ul>
          {data && data.map(item => (
            <li key={item.id}>
              ID: {item.id}, User ID: {item.user_id}, Product ID: {item.product_id}, Time Taken: {item.time_taken}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
