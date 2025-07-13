import { fetchWithAuth } from "../utils/fetchWithAuth";

export interface Friend {
    username: string;
    points: number;
}

export interface FriendshipStatus {
    status: string;
    areFriends: boolean;
    otherUser: string;
}

export interface FriendRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    receiver: {
        username: string;
    };
    sender:{
        username: string;
    };
}

const API_BASE_URL = 'http://localhost:8080';

export const getFriend = async (): Promise<Friend[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friends`);
    if (!res.ok){
        throw new Error('Failed to fetch friends');
    }
    const data = await res.json() 
    return data.friends ?? [];
};

export const getFriendshipStatus = async (otherUsername: string): Promise<FriendshipStatus> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friendship-status/${otherUsername}`);
    if (!res.ok){
        throw new Error('Failed to fetch friendship status');
    }
    return res.json();
}

export const getIncomingRequests = async(): Promise<FriendRequest[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friend-requests/incoming`);
    if (!res.ok){
        throw new Error('Failed to fetch incoming requests');
    }
    const data = await res.json() 
    return data.requests ?? [];
};

export const getOutgoingRequests = async(): Promise<FriendRequest[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friend-requests/outgoing`);
    if (!res.ok){
        throw new Error('Failed to fetch outgoing requests');
    }
    const data = await res.json() 
    return data.requests;
};

export const sendFriendRequest = async(receiverUsername: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friend-requests`, {
        method: 'POST',
        body: JSON.stringify({receiverUsername}),
    });
    if (!res.ok){
        throw new Error('Failed to send friend requests');
    }
};

export const acceptFriendRequest = async(id: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friend-requests/${id}/accept`, {
        method: 'POST',
        
    });
    if (!res.ok){
        throw new Error('Failed to accept friend request');
    }
};

export const rejectFriendRequest = async(id: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friend-requests/${id}/reject`, {
        method: 'POST',
    });
    if (!res.ok){
        throw new Error('Failed to reject friend requests');
    }
};

export const cancelFriendRequest = async(id: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friend-requests/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok){
        throw new Error('Failed to cancel friend requests');
    }
};


export const deleteFriend = async(friendUsername: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/friends/${friendUsername}`, {
        method: 'DELETE',
    });
    if (!res.ok){
        throw new Error('Failed to delete friend');
    }
};