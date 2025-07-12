import { useState, useEffect } from 'react';
import React from 'react';
import './MyFriends.css';
import { FaXmark } from 'react-icons/fa6';
import { GiCheckMark } from 'react-icons/gi';
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
  type FriendRequest,
} from '../api/friendship';

const MyFriends = () => {
  /* ---------------------------------------------------------------- */
  /*  STATE                                                           */
  /* ---------------------------------------------------------------- */
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [newFriendName, setNewFriendName] = useState('');
  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'friends' | 'incoming' | 'outgoing'>('friends');
  const [actionInProgress, setActionInProgress] = useState(false);

  /* ---------- Haupt-Tab-Leiste ---------- */
  const [activeMainTab, setActiveMainTab] =
    useState<'challenges' | 'friends' | 'ranks'>('friends');

  const navigate = useNavigate();

  /* ---------------------------------------------------------------- */
  /*  FETCH                                                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [friendsData, incomingData, outgoingData] = await Promise.all([
        getFriend(),
        getIncomingRequests(),
        getOutgoingRequests(),
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

  /* ---------------------------------------------------------------- */
  /*  HANDLER                                                         */
  /* ---------------------------------------------------------------- */
  const handleFriendInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setNewFriendName(username);
    if (username.trim()) {
      getFriendshipStatus(username.trim())
        .then(setFriendshipStatus)
        .catch(() => setFriendshipStatus(null));
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

  /* ---------- Card Component ---------- */
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
      <p>
        <strong className="username-underline">{name}</strong>
      </p>
      {points !== undefined && <p>{points} points</p>}
      <div className="button-group">
        {onAction &&
          (variant === 'incoming' ? (
            <span onClick={onAction} className="incoming-accept">
              {actionLabel}
            </span>
          ) : (
            <button onClick={onAction} className={buttonClass || ''}>
              {actionLabel}
            </button>
          ))}
        {secondaryAction &&
          (variant === 'incoming' ? (
            <span onClick={secondaryAction} className="incoming-reject">
              {secondaryActionLabel}
            </span>
          ) : (
            <button onClick={secondaryAction} className={buttonClass || ''}>
              {secondaryActionLabel}
            </button>
          ))}
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <main>
      {/* ======= HORIZONTALE HAUPT-TABBAR ======= */}
      <div className="top-tabbar">
        <button
          className={`top-tab ${activeMainTab === 'challenges' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveMainTab('challenges');
            navigate('/challenges');
          }}
        >
          Challenges
        </button>

        <button
          className={`top-tab ${activeMainTab === 'friends' ? 'is-active' : ''}`}
          onClick={() => setActiveMainTab('friends')}
        >
          Friends
        </button>

        <button
          className={`top-tab ${activeMainTab === 'ranks' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveMainTab('ranks');
            navigate('/ranking');
          }}
        >
          Ranks
        </button>
      </div>

      {/* ---------------------------------------- */}


      {/* Search + Add */}
      <div className="search-add-wrapper">
        <input
          type="text"
          placeholder="Add a Friend..."
          value={newFriendName}
          onChange={handleFriendInputChange}
          disabled={actionInProgress}
        />
        <button
          className="add-btn"
          onClick={handleSendRequest}
          disabled={
            actionInProgress ||
            !newFriendName.trim() ||
            friendshipStatus?.areFriends ||
            friendshipStatus?.status === 'PENDING'
          }
        >
          {friendshipStatus?.status === 'PENDING'
            ? 'Pending'
            : friendshipStatus?.areFriends
            ? 'Added'
            : 'Add'}
        </button>
      </div>

      {/* Status / Errors */}
      {loading && <p className="center-text">Loading data...</p>}
      {error && <p className="center-text error">{error}</p>}
      {friendshipStatus && newFriendName.trim() && (
        <p className="center-text">
          Status for <strong>{friendshipStatus.otherUser}</strong>:{' '}
          {friendshipStatus.areFriends ? "You're friends already!" : "You aren't friends yet!"}
        </p>
      )}

      {/* Unter-Tabs (Friends | Incoming | Outgoing) */}
      <div className="tab-bar">
        <button
          className={activeTab === 'friends' ? 'active-tab' : ''}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
        <button
          className={activeTab === 'incoming' ? 'active-tab' : ''}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming
        </button>
        <button
          className={activeTab === 'outgoing' ? 'active-tab' : ''}
          onClick={() => setActiveTab('outgoing')}
        >
          Outgoing
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        <div className="card-grid">
          {activeTab === 'friends' &&
            friends.map((friend) => (
              <UserCard
                key={friend.username}
                name={friend.username}
                points={friend.points}
                onAction={() => deleteFriend(friend.username).then(loadData)}
                actionLabel="Remove"
                buttonClass="remove-btn"
              />
            ))}

          {activeTab === 'incoming' &&
            incomingRequests.map((req) => (
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

          {activeTab === 'outgoing' &&
            outgoingRequests.map((req) => (
              <UserCard
                key={req.id}
                name={req.receiver.username || 'Unknown'}
                onAction={() => cancelFriendRequest(req.id).then(loadData)}
                actionLabel="Cancel"
                buttonClass="remove-btn"
              />
            ))}
        </div>
      </div>
    </main>
  );
};

export default MyFriends;
