import { useState, useEffect } from 'react';
import React from 'react';
import './MyFriends.css';
import { FaXmark } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => { loadData(); }, []);

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
    variant?: 'incoming';
  }) => (
    <div className="user-card">
      <p><strong className="username-underline">{name}</strong></p>
      {points !== undefined && <p>{points} points</p>}
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
  );

  return (
    <main>
      <div className="navigation-buttons">
        <button onClick={() => navigate('/challenges')} className="navigation-button">Challenges</button>
        <button onClick={() => navigate('/ranking')} className="navigation-button">Ranks</button>
      </div>

      <h1>Friends</h1>

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
              buttonClass="reject-cancel-remove-button"
            />
          ))}

          {activeTab === 'incoming' && incomingRequests.map(req => (
            <UserCard
              key={req.id}
              name={req.sender.username}
              onAction={() => acceptFriendRequest(req.id).then(loadData)}
              actionLabel={<GiCheckMark size={24} />}
              secondaryAction={() => rejectFriendRequest(req.id).then(loadData)}
              secondaryActionLabel={<FaXmark size={24} />}
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
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyFriends;
