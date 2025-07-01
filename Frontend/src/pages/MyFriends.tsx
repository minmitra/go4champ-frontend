import {useState, useEffect} from 'react';
import React from 'react';
import {getFriend, getIncomingRequests, sendFriendRequest, acceptFriendRequest,rejectFriendRequest, deleteFriend, type Friend, type FriendshipStatus, type FriendRequest, getFriendshipStatus, getOutgoingRequests, cancelFriendRequest} from '../api/friendship';
import { useNavigate } from 'react-router-dom';

const MyFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus | null>(null);
  const[incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const[outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [newFriendName, setNewFriendName] = useState('');
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState<string | null>(null);
  const[success, setSuccess] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [friendsData, incomingData, outgoingData] = await Promise.all([
        getFriend(),
        getIncomingRequests(),
        getOutgoingRequests(),
      ]);

      //DEBUG
      console.log('Friends data:', friendsData);
      console.log('Incoming requests', incomingData);
      console.log('Outgoing requests', outgoingData);

      setFriends(Array.isArray(friendsData) ? friendsData : []);
      setIncomingRequests(Array.isArray(incomingData) ? incomingData : []);
      setOutgoingRequests(Array.isArray(outgoingData) ? outgoingData : []);
    }
    catch(error: any){
      setError(error.message || 'Error loading data');
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  },[success]);

  const checkFriendshipStatus = async (username: string) => {
    try {
      const status = await getFriendshipStatus(username);
      setFriendshipStatus(status);
    } 
    catch (error) {
      setFriendshipStatus(null);
    }
  };

  const handleFriendInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setNewFriendName(username);

    if (username.trim()){
      checkFriendshipStatus(username.trim());
    }
    else {
      setFriendshipStatus(null);
    }
  };

  const handleSendRequest = async () => {
    if (!newFriendName.trim()){
      return;
    }
    else{
      setActionInProgress(true);
      setError(null);
      setSuccess(null);
    }

    try{
      await sendFriendRequest(newFriendName.trim());
      setNewFriendName('');
      await loadData();
      setSuccess('Friend request was sent successfully!');
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
    setSuccess(null);
    try{
      await acceptFriendRequest(id);
      await loadData();
      setSuccess('You have become friends.')
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
    setSuccess(null);
    try {
      await rejectFriendRequest(id);
      await loadData();
      setSuccess('Friend was rejected.')
    }
    catch (error: any) {
      setError(error.message || 'Error rejecting friend request');
    }
    finally {
      setActionInProgress(false);
    }
  };

    const handleCancelRequest = async (id: string) => {
    setActionInProgress(true);
    setError(null);
    setSuccess(null);
    try {
      await cancelFriendRequest(id);
      await loadData();
      setSuccess('Friend request was canceled.')
    }
    catch (error: any) {
      setError(error.message || 'Error canceling friend request');
    }
    finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteFriend = async (username: string) => {
    setActionInProgress(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteFriend(username);
      await loadData();
      setSuccess('Friend deleted.')
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

      {/*Navigation zu MyChallenges.tsx*/}
            <button onClick={() => navigate("/challenges")}>Back</button>


      {loading && <p>Loading data...</p>}
      {error && <p className='error-message'>{error}</p>}

      <section className='friends-list-section'>
        <h2>Your Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend.username}>
              {friend.username} - {friend.points} points
              <button disabled={actionInProgress} onClick={() => handleDeleteFriend(friend.username)} >Remove</button>
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
              {req.sender.username}
              <button disabled={actionInProgress} onClick={() => handleAcceptRequest(req.id)}>Accept</button>
              <button disabled={actionInProgress} onClick={() => handleRejectRequest(req.id)}>Reject</button>
            </li>
          ))}
          {incomingRequests.length === 0 && !loading && <p>No incoming requests.</p>}
        </ul>
      </section>

      <section className='outgoing-requests-section'>
        <h2>Outgoing Friend Requests</h2>
        <ul>
          {outgoingRequests.map((req) => (
            <li key={req.id}> 
              {req.receiver.username || 'Unknown User'}
              <button disabled={actionInProgress} onClick={() => handleCancelRequest(req.id.toString())}>Cancel</button>
            </li>
          ))}
          {outgoingRequests.length === 0 && !loading && <p>No outgoing requests.</p>}
        </ul>
      </section>

      <section className="send-request-section">
        <h2>Add a Friend</h2>
        <input
          type="text"
          placeholder='Enter username'
          value={newFriendName}
          onChange={handleFriendInputChange} disabled={actionInProgress}
        />
        {friendshipStatus && newFriendName.trim() && (
          <p> Status for <strong>{friendshipStatus.otherUser}</strong>: <br/>
          {friendshipStatus.areFriends ? "You're friends already!" : "You aren't friends yet!"}</p>
        )}
        <button onClick={handleSendRequest} 
          disabled={
            actionInProgress || 
            !newFriendName.trim() || 
            friendshipStatus?.areFriends || 
            friendshipStatus?.status === 'PENDING'
          }
        >
          {friendshipStatus?.status === 'PENDING' ? 'Request Pending' : friendshipStatus?.areFriends ? 'Already Friends' : 'Send Request'} 
        </button>
      </section>
    </div>
  );

};

export default MyFriends;








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