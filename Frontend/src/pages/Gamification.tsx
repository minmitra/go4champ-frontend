import React, { useState } from 'react';
import './Gamification.css';

const Gamification = () => {
  const [friends, setFriends] = useState([
    { name: 'Anna', points: 1200 },
    { name: 'Lukas', points: 950 },
    { name: 'Mia', points: 800 },
  ]);
  const [newFriend, setNewFriend] = useState('');
  const [userLevel, setUserLevel] = useState(5);
  const [userPoints, setUserPoints] = useState(1050);

  const handleAddFriend = () => {
    if (newFriend.trim()) {
      setFriends([...friends, { name: newFriend.trim(), points: 0 }]);
      setNewFriend('');
    }
  };

  const sortedFriends = [...friends].sort((a, b) => b.points - a.points);

  return (
    <main>
    <div>
      <h1>Gamification</h1>

      <div className="stats-card">
        <h2>Your Stats</h2>
        <p>Level: <strong>{userLevel}</strong></p>
        <p>Points: <strong>{userPoints}</strong></p>
      </div>

      <div className="friends-section">
        <h2>Friends Leaderboard</h2>
        <ul className="friends-list">
          {sortedFriends.map((friend, index) => (
            <li key={index}>
              <span className="friend-name">{friend.name}</span>
              <span className="friend-points">{friend.points} pts</span>
            </li>
          ))}
        </ul>

        <div className="add-friend">
          <input
            type="text"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            placeholder="Add a friend"
          />
          <button onClick={handleAddFriend}>Add</button>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Gamification;