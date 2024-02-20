import React, { useState } from 'react';

function UserData() {
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState('');

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

  const handleFetchDataClick = () => {
    fetchData();
  };

  return (
    <div>
      <h1>User Data Page</h1>
      <p>Enter the user id </p>
      <div>
        <label htmlFor="user_id">User ID: </label>
        <input type="text" id="user_id" value={userID} onChange={handleUserIDChange} />
        <button onClick={handleFetchDataClick}>Fetch Data</button>
      </div>
      <ul>
        {data && data.map(item => (
          <li key={item.id}>
            ID: {item.id}, User ID: {item.user_id}, Product ID: {item.product_id}, Time Taken: {item.time_taken}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserData;
