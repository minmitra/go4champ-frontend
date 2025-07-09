import { fetchWithAuth } from "../utils/fetchWithAuth";

export interface UserStats {
  username: string;
  name: string;
  avatarId?: string;

  totalTrainings: number;
  monthlyTrainings: number;
  weeklyTrainings: number;
  todayTrainings: number;

  totalChallenges: number;
  wonChallenges: number;
  lostChallenges: number;
  challengeWinRate: number;

  currentStreak: number;
  longestStreak: number;
  consistencyScore: number;

  averageDifficulty: number;
  maxDifficulty: number;
  totalTrainingTime: number;
  averageTrainingTime: number;

  lastTrainingDate: string;
  hasTrainedToday: boolean;
  daysActive: number;

  overallRank: number;
  monthlyRank: number;
  streakRank: number;
  challengeRank: number;
  consistencyRank: number;
}

export interface RankingEntry {
  username: string;
  displayName?: string;
  avatarId?: string;

  rank: number;
  score: number;
}

export interface RankingResponse {
  rankingType: string;
  title: string;
  description?: string;
  period?: string;

  entries: RankingEntry[];
  totalEntries: number;
  currentUserPosition: number;
  currentUserInTopList: boolean;

  lastUpdated: string;
  updateFrequency?: string;
}
export interface FriendRankingEntry {
  username: string;
  displayName: string;
  profileImageUrl?: string;
  score: number;
}

export interface FriendRankingResponse {
  friends: FriendRankingEntry[];
  currentUserPosition: number;
}

export function isRankingResponse(
  response: RankingResponse | FriendRankingResponse | undefined
): response is RankingResponse {
  return response !== undefined && "entries" in response;
}





export const getRankingOverview = async (): Promise<{
  recentAchievements: any[]; // Typ ggf. noch spezifizieren
  upcomingMilestones: any[];
  currentUserStats: UserStats;
}> => {
  const res = await fetchWithAuth('http://localhost:8080/api/rankings/overview', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch ranking overview');
  }

  return await res.json();
};

export const getMyStats = async (): Promise<UserStats> => {
  const res = await fetchWithAuth('http://localhost:8080/api/rankings/my-stats', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch my stats');
  }

  return await res.json();
};

export const getGlobalTrainingRanking = async (limit: number = 10): Promise<RankingResponse> => {
  const res = await fetchWithAuth(`http://localhost:8080/api/rankings/global/trainings?limit=${limit}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch global training ranking');
  }

  return await res.json();
};

export const getMonthlyTrainingRanking = async (limit: number = 10): Promise<RankingResponse> => {
  const res = await fetchWithAuth(`http://localhost:8080/api/rankings/global/monthly?limit=${limit}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch monthly training ranking');
  }

  return await res.json();
};

export const getStreakRanking = async (limit: number = 10): Promise<RankingResponse> => {
  const res = await fetchWithAuth(`http://localhost:8080/api/rankings/global/streaks?limit=${limit}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch streak ranking');
  }

  return await res.json();
};

export const getFriendMonthlyRanking = async (): Promise<RankingResponse> => {
  const res = await fetchWithAuth('http://localhost:8080/api/rankings/friends/monthly', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch friend monthly ranking');
  }

  return await res.json();
};

export const getFriendStreakRanking = async (): Promise<FriendRankingResponse> => {
  const res = await fetchWithAuth('http://localhost:8080/api/rankings/friends/streaks', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch friend streak ranking');
  }

  return await res.json();
};

export const getUserStats = async (targetUsername: string): Promise<UserStats> => {
  const res = await fetchWithAuth(`http://localhost:8080/api/rankings/user/${targetUsername}/stats`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user stats');
  }

  return await res.json();
};

export const getLeaderboard = async (
  category: 'trainings' | 'total' | 'monthly' | 'streaks' | 'streak' = 'trainings',
  scope: 'global' | 'friends' = 'global',
  limit: number = 10
): Promise<{ category: string; scope: string; ranking: RankingResponse }> => {
  const params = new URLSearchParams({
    category,
    scope,
    limit: limit.toString(),
  });

  const res = await fetchWithAuth(`http://localhost:8080/api/rankings/leaderboard?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return await res.json();
};

export const getRankingSummary = async (): Promise<{
  myStats: UserStats;
  topTrainings: RankingEntry[];
  topMonthly: RankingEntry[];
  topStreaks: RankingEntry[];
  myPositions: {
    global: number;
    monthly: number;
    streak: number;
  };
}> => {
  const res = await fetchWithAuth('http://localhost:8080/api/rankings/summary', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch ranking summary');
  }

  return await res.json();
};

export const getAchievements = async (): Promise<{
  achievements: any[];
  milestones: any[];
  userStats: UserStats;
}> => {
  const res = await fetchWithAuth('http://localhost:8080/api/rankings/achievements', {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch achievements');
  }

  return await res.json();
};

export const getRankingHistory = async (
  period: string = 'monthly'
): Promise<{ message: string; currentStats: UserStats; period: string }> => {
  const res = await fetchWithAuth(`http://localhost:8080/api/rankings/history?period=${period}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch ranking history');
  }

  return await res.json();
};
