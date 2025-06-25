import { fetchWithAuth } from "../utils/fetchWithAuth";

export interface Friend {
    name: string;
    points: number;
}

export interface FriendRequest {
    id: string;
    fromUser: string;
    toUser: string;
}

export const getFriend = async (): Promise<Friend[]> => {
    const res = await fetchWithAuth('/api/me/friends');
    if (!res.ok){
        throw new Error('Failed to fetch friends');
    }
    return res.json();
};

export const getIncomingRequests = async(): Promise<FriendRequest[]> => {
    const res = await fetchWithAuth('/api/me/friend-requests/incoming');
    if (!res.ok){
        throw new Error('Failed to fetch incoming requests');
    }
    return res.json();
};

export const getOutgoingRequests = async(): Promise<FriendRequest[]> => {
    const res = await fetchWithAuth('/api/me/friend-requests/outgoing');
    if (!res.ok){
        throw new Error('Failed to fetch outgoing requests');
    }
    return res.json();
};

export const sendFriendRequest = async(username: string): Promise<void> => {
    const res = await fetchWithAuth('/api/me/friend-requests', {
        method: 'POST',
        body: JSON.stringify({username}),
    });
    if (!res.ok){
        throw new Error('Failed to send friend requests');
    }
};

export const acceptFriendRequest = async(requestId: string): Promise<void> => {
    const res = await fetchWithAuth(`/api/me/friend-requests/${requestId}/accept`, {
        method: 'POST',
    });
    if (!res.ok){
        throw new Error('Failed to accept friend requests');
    }
};

export const rejectFriendRequest = async(requestId: string): Promise<void> => {
    const res = await fetchWithAuth(`/api/me/friend-requests/${requestId}/reject`, {
        method: 'POST',
    });
    if (!res.ok){
        throw new Error('Failed to reject friend requests');
    }
};

export const deleteFriend = async(friendUsername: string): Promise<void> => {
    const res = await fetchWithAuth(`/api/me/friends/${friendUsername}`, {
        method: 'DELETE',
    });
    if (!res.ok){
        throw new Error('Failed to delete friend');
    }
};