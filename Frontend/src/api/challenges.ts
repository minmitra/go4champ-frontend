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

export interface Challenge {
    id: number;
    challengerUsername: string;
    opponentUsername: string;
    gameId: number;
    gameName: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    message: string;
    title?: string;
    description?: string;
    type?: ChallengeType;
    targetValue?: number;
    targetUnit?: string;
    deadline?: string;
};

export interface ChallengeOverview {
    totalChallenges: number;
    totalWins: number;
    totalLosses: number;
};

export const getMyChallenges = async (): Promise<Challenge[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/my', {
        method: 'GET',
    });

    if (!res.ok){
        throw new Error('Failed to fetch challenges');
    }
    const data = await res.json();
    return data.challenges;
}

export const createChallenge = async (challenge: CreateChallengeRequest): Promise<Challenge> => {
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

export const acceptChallenge = async (challengeId:number): Promise<Challenge> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/accept`, {
        method: 'POST',
    });

    if (!res.ok){
        throw new Error('Failed to accept challenges');
    }
    return await res.json();
};


export const rejectChallenge = async (challengeId:number): Promise<Challenge> => {
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
): Promise<Challenge> => {
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
): Promise<Challenge> => {
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

export const getChallengeDetails = async (challengeId: number): Promise<Challenge> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load challenge details');
    }
    return await res.json();
};

export const getIncomingChallenges = async (): Promise<Challenge[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/incoming', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load incoming challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getOutgoingChallenges = async (): Promise<Challenge[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/outgoing', {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to load outgoing challenges');
    }
    const data = await res.json();
    return data.challenges;
};

export const getActiveChallenges = async (): Promise<Challenge[]> => {
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


