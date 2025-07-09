import { useState, useEffect } from 'react';
import React from 'react';
import './MyFriends.css';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaXmark } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";

import {
  getFriend,
  getIncomingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
  getFriendshipStatus,
  getOutgoingRequests,
  cancelFriendRequest,
  type Friend,
  type FriendshipStatus,
  type FriendRequest
} from '../api/friendship';

const MyFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [newFriendName, setNewFriendName] = useState('');
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'friends' | 'incoming' | 'outgoing'>('friends');
  const [actionInProgress, setActionInProgress] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [friendsData, incomingData, outgoingData] = await Promise.all([
        getFriend(),
        getIncomingRequests(),
        getOutgoingRequests()
      ]);
      setFriends(Array.isArray(friendsData) ? friendsData : []);
      setIncomingRequests(Array.isArray(incomingData) ? incomingData : []);
      setOutgoingRequests(Array.isArray(outgoingData) ? outgoingData : []);
    } catch (error: any) {
      setError(error.message || 'Error loading data');
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleFriendInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setNewFriendName(username);
    if (username.trim()) {
      getFriendshipStatus(username.trim()).then(setFriendshipStatus).catch(() => setFriendshipStatus(null));
    } else {
      setFriendshipStatus(null);
    }
  };

  const handleSendRequest = async () => {
    if (!newFriendName.trim()) return;
    setActionInProgress(true);
    try {
      await sendFriendRequest(newFriendName.trim());
      setNewFriendName('');
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Error sending friend request');
    } finally {
      setActionInProgress(false);
    }
  };

  const UserCard = ({
    name,
    points,
    onAction,
    actionLabel,
    buttonClass,
     actionType,  
    secondaryAction,
    secondaryActionLabel,
    variant,
  }: {
    name: string;
    points?: number;
    onAction?: () => void;
    actionLabel?: React.ReactNode;    
    buttonClass?: string;
    secondaryAction?: () => void;
   secondaryActionLabel?: React.ReactNode;
   actionType?: 'accept' | 'reject';
   variant?: 'incoming';
  }) => (
    <div className="user-card">
      <p><strong className="username-underline">{name}</strong></p>
      {points !== undefined && <p>{points} points</p>}
       {points !== undefined && <p>{points} points</p>}
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      <div className="button-group">
        {onAction && (
          variant === "incoming" ? (
            <span onClick={onAction} className="incoming-accept">
              {actionLabel}
            </span>
          ) : (
            <button onClick={onAction} className={buttonClass || ''}>
              {actionLabel}
            </button>
          )
        )}
        {secondaryAction && (
          variant === "incoming" ? (
            <span onClick={secondaryAction} className="incoming-reject">
              {secondaryActionLabel}
            </span>
          ) : (
            <button onClick={secondaryAction} className={buttonClass || ''}>
              {secondaryActionLabel}
            </button>
          )
        )}
      </div>
    </div>
  </div>
);

  return (
    <main>
      <h1>My Friends</h1>
      <div className="wrapper">
        <input
          type="text"
          placeholder="Add a Friend..."
          value={newFriendName}
          onChange={handleFriendInputChange}
          disabled={actionInProgress}
        />
        <button
          className="search-button"
          onClick={handleSendRequest}
          disabled={actionInProgress || !newFriendName.trim() || friendshipStatus?.areFriends || friendshipStatus?.status === 'PENDING'}
        >
          {friendshipStatus?.status === 'PENDING' ? 'Pending' : friendshipStatus?.areFriends ? 'Added' : 'Add'}
        </button>
      </div>

      {loading && <p className="center-text">Loading data...</p>}
      {error && <p className="center-text error">{error}</p>}
      {friendshipStatus && newFriendName.trim() && (
        <p className="center-text">
          Status for <strong>{friendshipStatus.otherUser}</strong>: {friendshipStatus.areFriends ? "You're friends already!" : "You aren't friends yet!"}
        </p>
      )}

      <div className="tab-bar">
        <button className={activeTab === 'friends' ? 'active-tab' : ''} onClick={() => setActiveTab('friends')}><p>Friends</p></button>
        <button className={activeTab === 'incoming' ? 'active-tab' : ''} onClick={() => setActiveTab('incoming')}><p>Incoming requests</p></button>
        <button className={activeTab === 'outgoing' ? 'active-tab' : ''} onClick={() => setActiveTab('outgoing')}><p>Outgoing requests</p></button>
      </div>

      <div className="tab-content-wrapper">
        <div className="card-c">
          {activeTab === 'friends' && friends.map(friend => (
            <UserCard
              key={friend.username}
              name={friend.username}
              points={friend.points}
              onAction={() => deleteFriend(friend.username).then(loadData)}
              actionLabel="Remove"
               actionType="reject" 
               buttonClass="reject-cancel-remove-button"
            />
          ))}
         
          {activeTab === 'incoming' && incomingRequests.map(req => (
<UserCard
  key={req.id}
  name={req.sender.username}
  onAction={() => acceptFriendRequest(req.id).then(loadData)}
  actionLabel={<span className="incoming-accept"><GiCheckMark size={32} /></span>}
  secondaryAction={() => rejectFriendRequest(req.id).then(loadData)}
  secondaryActionLabel={<span className="incoming-reject"><FaXmark size={32}  /></span>}
  variant="incoming"
/>

))}

          {activeTab === 'outgoing' && outgoingRequests.map(req => (
            <UserCard
              key={req.id}
              name={req.receiver.username || 'Unknown'}
              onAction={() => cancelFriendRequest(req.id).then(loadData)}
              actionLabel="Cancel"
              buttonClass="reject-cancel-remove-button"
               actionType="reject" 
            />
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={() => navigate('/challenges')} className="navigation-button">
          <FaAngleLeft className="left-icon" /><p>Challenges</p>
        </button>
        <button onClick={() => navigate('/ranking')} className="navigation-button right-align">
          <p>Ranking </p><FaAngleRight className="right-icon" />
        </button>
      </div>
    </main>
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