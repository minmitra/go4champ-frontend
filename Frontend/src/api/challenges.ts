import { fetchWithAuth } from "../utils/fetchWithAuth";


export type ChallengeType = 'TIME' | 'REPS' | 'WEIGHT' | 'FREE';

export interface CreateChallengeRequest{
    challengedUsername: string;
    type: ChallengeType;
    title: string;
    description: string;
    targetValue: number;
    targetUnit: string;
    deadline: string;
}

export interface ChallengeResponse {
  id: number;
  challengerUsername: string;
  challengerName: string;
  challengedUsername: string;
  challengedName: string;
  type: ChallengeType;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  title: string;
  description?: string;
  targetValue?: number;
  targetUnit?: string;
  challengerResult?: number;
  challengedResult?: number;
  winnerUsername?: string;
  winnerName?: string;
  challengerSubmitted?: boolean;
  challengedSubmitted?: boolean;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  deadline?: string;
  expired: boolean;
  myRole: 'CHALLENGER' | 'CHALLENGED';
}

export interface ChallengeOverview {
    totalChallenges: number;
    totalWins: number;
    totalLosses: number;
};


const API_BASE_URL = 'https://go4champ-backend-x.onrender.com';

export const getMyChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/my`, {
        method: 'GET',
    });

    if (!res.ok){
        throw new Error('Failed to fetch challenges');
    }
    const data = await res.json();
    console.log("Raw challenge data from backend:", data);
    return data.challenges;
}

export const createChallenge = async (challenge: CreateChallengeRequest): Promise<ChallengeResponse> => {
    console.log("createChallenge payload:", challenge);
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(challenge),
    });

    if (!res.ok){
        throw new Error('Failed to create challenges');
    }
    return await res.json();
};

export const acceptChallenge = async (challengeId:number): Promise<ChallengeResponse> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/${challengeId}/accept`, {
        method: 'POST',
    });

    if (!res.ok){
        throw new Error('Failed to accept challenges');
    }
    return await res.json();
};


export const rejectChallenge = async (challengeId:number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/${challengeId}/reject`, {
        method: 'POST',
    });

    if (!res.ok){
        throw new Error('Failed to reject challenges');
    }
};


export const cancelChallenge = async (challengeId: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/${challengeId}/cancel`, {
        method: 'POST',
    });
    if (!res.ok){
        throw new Error('Failed to cancel challenge');
    }
};

export async function submitChallengeResult(
  challengeId: number,
  data: { result: number; comment?: string }
) {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/${challengeId}/submit-result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Submit failed");
  }

  return await res.json();
}




export async function declareWinner(
  challengeId: number,
  winnerUsername: "challenger" | "challenged" | "tie",
  reason: string = ""
) {
  const token = localStorage.getItem("token");

  const body = JSON.stringify({ winnerUsername, reason });
  console.log("declareWinner body:", body);  // Zum Debuggen

  const res = await fetch(`${API_BASE_URL}/api/challenges/${challengeId}/declare-winner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("declareWinner error response:", errorText);
    throw new Error(`Fehler beim Senden des Siegers: ${errorText}`);
  }

  return await res.json();
}




export const getChallengeDetails = async (challengeId: number): Promise<ChallengeResponse> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/${challengeId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load challenge details');
    }
    return await res.json();
};

export const getIncomingChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/incoming`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load incoming challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getOutgoingChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/outgoing`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load outgoing challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getActiveChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/active`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load active challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getChallengeOverview = async (): Promise<ChallengeOverview> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/challenges/overview`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load challenge overview');
    }
    return await res.json();
};




