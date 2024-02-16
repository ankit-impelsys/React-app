import React, { useState } from 'react';

function UserStats() {
  const [userId, setUserId] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/userStats?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUserStats();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={handleChange}
          placeholder="Enter User ID"
          required
        />
        <button type="submit">Get User Stats</button>
      </form>
      {error && <p>{error}</p>}
      {stats && (
        <div>
          <h2>User Stats</h2>
          <p>
            <strong>Product ID:</strong> {stats.product_id}
          </p>
          <p>
            <strong>Time Taken:</strong> {stats.time_taken} milliseconds
          </p>
        </div>
      )}
    </div>
  );
}

export default UserStats;
