import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8080/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Basic React App!</h1>
        <p>This is the home page.</p>
        <ul>
          {data.map(item => (
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
