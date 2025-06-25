import React, {useState, useEffect} from 'react';
import {getFriend, getIncomingRequests, sendFriendRequest, acceptFriendRequest,rejectFriendRequest, deleteFriend, type Friend, type FriendRequest} from '../api/friendship';

const Gamification = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const[incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [newFriendName, setNewFriendName] = useState('');
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [friendsData, incomingData] = await Promise.all([
        getFriend(),
        getIncomingRequests(),
      ]);
      setFriends(friendsData);
      setIncomingRequests(incomingData);
    }
    catch(error: any){
      setError(error.message || 'Error loading data');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendRequest = async () => {
    if (!newFriendName.trim()){
      return;
    }
    else{
      setActionInProgress(true);
      setError(null);
    }

    try{
      await sendFriendRequest(newFriendName.trim());
      setNewFriendName('');
      await loadData();
    }
    catch (error: any){
      setError(error.message || 'Error sending friend request');
    }
    finally{
      setActionInProgress(false);
    }
  };

  const handleAcceptRequest = async (id: string) => {
    setActionInProgress(true);
    setError(null);
    try{
      await acceptFriendRequest(id);
      await loadData();
    }
    catch (error: any){
      setError(error.message || 'Error accepting friend request');
    }
    finally{
      setActionInProgress(false);
    }
  };

  const handleRejectRequest = async (id: string) => {
    setActionInProgress(true);
    setError(null);
    try {
      await rejectFriendRequest(id);
      await loadData();
    }
    catch (error: any) {
      setError(error.message || 'Error rejecting friend request');
    }
    finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteFriend = async (username: string) => {
    setActionInProgress(true);
    setError(null);
    try {
      await deleteFriend(username);
      await loadData();
    }
    catch (error: any) {
      setError(error.message || 'Error deleting friend');
    }
    finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className='gamification-page'>
      <h1>Gamification</h1>

      {loading && <p>Loading data...</p>}
      {error && <p className='error-message'>{error}</p>}

      <section className='friends-list-section'>
        <h2>Your Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend.name}>
              {friend.name} - {friend.points} points
              <button disabled={actionInProgress} onClick={() => handleDeleteFriend(friend.name)} >Remove</button>
            </li> 
          ))}
          {friends.length === 0 && !loading && <p>No friends yet.</p>}
        </ul>
      </section>

      <section className='friend-requests-section'>
        <h2>Incoming Friend Requests</h2>
        <ul>
          {incomingRequests.map((req) => (
            <li key={req.id}> 
              {req.fromUser}
              <button disabled={actionInProgress} onClick={() => handleAcceptRequest(req.id)}>Accept</button>
              <button disabled={actionInProgress} onClick={() => handleRejectRequest(req.id)}>Reject</button>
            </li>
          ))}
          {incomingRequests.length === 0 && !loading && <p>No incoming requests.</p>}
        </ul>
      </section>

      <section className="send-request-section">
        <h2>Add a Friend</h2>
        <input
          type="text"
          placeholder='Enter username'
          value={newFriendName}
          onChange={(error) => setNewFriendName(error.target.value)} disabled={actionInProgress}
        />
        <button onClick={handleSendRequest} disabled={actionInProgress || !newFriendName.trim()}>Send Request</button>
      </section>
    </div>
  );

};

export default Gamification;








// import React, { useState } from 'react';
// import './Gamification.css';

// const Gamification = () => {
//   const [friends, setFriends] = useState([
//     { name: 'Anna', points: 1200 },
//     { name: 'Lukas', points: 950 },
//     { name: 'Mia', points: 800 },
//   ]);
//   const [newFriend, setNewFriend] = useState('');
//   const [userLevel, setUserLevel] = useState(5);
//   const [userPoints, setUserPoints] = useState(1050);

//   const handleAddFriend = () => {
//     if (newFriend.trim()) {
//       setFriends([...friends, { name: newFriend.trim(), points: 0 }]);
//       setNewFriend('');
//     }
//   };

//   const sortedFriends = [...friends].sort((a, b) => b.points - a.points);

//   return (
//     <div className="gamification-page">
//       <h1>Gamification</h1>

//     <div className="coming-soon-fullscreen">
//     <span>Coming Soon</span>
//     </div>

//       <div className="stats-card">
//         <h2>Your Stats</h2>
//         <p>Level: <strong>{userLevel}</strong></p>
//         <p>Points: <strong>{userPoints}</strong></p>
//       </div>

//       <div className="friends-section">
//         <h2>Friends Leaderboard</h2>
//         <ul className="friends-list">
//           {sortedFriends.map((friend, index) => (
//             <li key={index}>
//               <span className="friend-name">{friend.name}</span>
//               <span className="friend-points">{friend.points} pts</span>
//             </li>
//           ))}
//         </ul>

//         <div className="add-friend">
//           <input
//             type="text"
//             value={newFriend}
//             onChange={(e) => setNewFriend(e.target.value)}
//             placeholder="Add a friend"
//           />
//           <button onClick={handleAddFriend}>Add</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Gamification;