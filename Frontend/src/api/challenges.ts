import { fetchWithAuth } from "../utils/fetchWithAuth";


export type ChallengeType = 'TIME' | 'REPS' | 'WEIGHT' | 'FREE';

export interface CreateChallengeRequest{
    challengedUsername: string;
    type: ChallengeType;
    title: string;
    description?: string;
    targetValue?: number;
    targetUnit?: string;
    deadline?: string;
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

export const getMyChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/my', {
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
    const res = await fetchWithAuth('http://localhost:8080/api/challenges', {
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
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/accept`, {
        method: 'POST',
    });

    if (!res.ok){
        throw new Error('Failed to accept challenges');
    }
    return await res.json();
};


export const rejectChallenge = async (challengeId:number): Promise<ChallengeResponse> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/reject`, {
        method: 'POST',
    });

    if (!res.ok){
        throw new Error('Failed to reject challenges');
    }
    return await res.json();
};


// Challenge abbrechen (z. B. vom Ersteller)
export const cancelChallenge = async (challengeId: number): Promise<void> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/cancel`, {
        method: 'POST',
    });
    if (!res.ok){
        throw new Error('Failed to cancel challenge');
    }
};

// Ergebnis einreichen
export const submitChallengeResult = async (
    challengeId: number,
    myScore: number,
    opponentScore: number
): Promise<ChallengeResponse> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/submit-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myScore, opponentScore }),
    });
    if (!res.ok) {
        throw new Error('Failed to submit result');
    }
    return await res.json();
};

// Sieger deklarieren (nur für FREE challenges)
export const declareWinner = async (
    challengeId: number,
    winnerUsername: string
): Promise<ChallengeResponse> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/declare-winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerUsername }),
    });
    if (!res.ok) {
        throw new Error('Failed to declare winner');
    }
    return await res.json();
};

export const getChallengeDetails = async (challengeId: number): Promise<ChallengeResponse> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load challenge details');
    }
    return await res.json();
};

export const getIncomingChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/incoming', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load incoming challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getOutgoingChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/outgoing', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load outgoing challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getActiveChallenges = async (): Promise<ChallengeResponse[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/active', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load active challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getChallengeOverview = async (): Promise<ChallengeOverview> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/overview', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load challenge overview');
    }
    return await res.json();
};




