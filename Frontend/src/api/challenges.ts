import { fetchWithAuth } from "../utils/fetchWithAuth";

export interface Challenge {
    id: number;
    challengerUsername: string;
    opponentUsername: string;
    gameId: number;
    gameName: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}

export const getMyChallenges = async (): Promise<Challenge[]> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges/my', {
        method: 'GET',
    });

    if (!res.ok){
        throw new Error('Failed to fetch challenges');
    }
    return await res.json();
}

export const createChallenge = async (opponentUsername:string, gameId: string): Promise<Challenge> => {
    const res = await fetchWithAuth('http://localhost:8080/api/challenges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            opponentUsername,
            gameId,
        }),
    });

    if (!res.ok){
        throw new Error('Failed to create challenges');
    }
    return await res.json();
};

export const acceptChallenge = async (challengeId:number): Promise<Challenge> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/accept`, {
        method: 'PUT',
    });

    if (!res.ok){
        throw new Error('Failed to accept challenges');
    }
    return await res.json();
};


export const rejectChallenge = async (challengeId:number): Promise<Challenge> => {
    const res = await fetchWithAuth(`http://localhost:8080/api/challenges/${challengeId}/reject`, {
        method: 'PUT',
    });

    if (!res.ok){
        throw new Error('Failed to reject challenges');
    }
    return await res.json();
};



