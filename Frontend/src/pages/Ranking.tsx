/* ------------------------------------------------------------------ */
/*  IMPORTS                                                           */
/* ------------------------------------------------------------------ */
import './Ranking.css';
import React, { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  getRankingOverview,
  getGlobalTrainingRanking,
  getMonthlyTrainingRanking,
  getStreakRanking,
  getFriendStreakRanking,
  isRankingResponse,
  type UserStats,
  type RankingResponse,
  type FriendRankingResponse,
  type FriendRankingEntry,
} from '../api/rankings';

import { FaGlobe, FaCalendarAlt, FaFire, FaUserFriends } from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  TYPES + TAB CONFIG                                                */
/* ------------------------------------------------------------------ */
type TabId = 'trainings' | 'monthly' | 'streaks' | 'friends';

const tabs: { id: TabId; label: string; icon: JSX.Element }[] = [
  { id: 'trainings', label: 'Global',   icon: <FaGlobe /> },
  { id: 'monthly',   label: 'Monthly',  icon: <FaCalendarAlt /> },
  { id: 'streaks',   label: 'Streaks',  icon: <FaFire /> },
  { id: 'friends',   label: 'Friends',  icon: <FaUserFriends /> },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */
const Ranking: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* Top-Tabbar */
  const [activeMainTab, setActiveMainTab] =
    useState<'challenges' | 'friends' | 'ranks'>('ranks');

  /* ---------- Overview & Stats ---------- */
  const [overviewData, setOverviewData] = useState<{
    recentAchievements: any[];
    upcomingMilestones: any[];
    currentUserStats: UserStats;
  } | null>(null);

  /* ---------- Rankings per Tab ---------- */
  const [rankings, setRankings] = useState<
    Partial<Record<TabId, RankingResponse | FriendRankingResponse>>
  >({});

  const [loadingTabs, setLoadingTabs] = useState<Record<TabId, boolean>>({
    trainings: true,
    monthly: false,
    streaks: false,
    friends: false,
  });

  const [errorTabs, setErrorTabs] = useState<Record<TabId, string | null>>({
    trainings: null,
    monthly: null,
    streaks: null,
    friends: null,
  });

  const [activeTab, setActiveTab] = useState<TabId>('trainings');

  /* ---------- Fetch Overview (once) ---------- */
  useEffect(() => {
    (async () => {
      try {
        const overview = await getRankingOverview();
        setOverviewData(overview);
      } catch (err) {
        console.error('Error fetching overview:', err);
      }
    })();
  }, []);

  /* ---------- Fetch Ranking for Active Tab ---------- */
  useEffect(() => {
    if (rankings[activeTab]) return; // already loaded

    (async () => {
      setLoadingTabs((prev) => ({ ...prev, [activeTab]: true }));
      setErrorTabs((prev) => ({ ...prev, [activeTab]: null }));

      try {
        let data: RankingResponse | FriendRankingResponse;
        switch (activeTab) {
          case 'trainings':
            data = await getGlobalTrainingRanking(10);
            break;
          case 'monthly':
            data = await getMonthlyTrainingRanking(10);
            break;
          case 'streaks':
            data = await getStreakRanking(10);
            break;
          case 'friends':
            data = await getFriendStreakRanking();
            break;
          default:
            throw new Error('Unknown tab');
        }
        setRankings((prev) => ({ ...prev, [activeTab]: data }));
      } catch (err) {
        setErrorTabs((prev) => ({
          ...prev,
          [activeTab]: (err as Error).message,
        }));
      } finally {
        setLoadingTabs((prev) => ({ ...prev, [activeTab]: false }));
      }
    })();
  }, [activeTab, rankings]);

  /* ---------- Render ---------- */
  const stats = overviewData?.currentUserStats;

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
          onClick={() => {
            setActiveMainTab('friends');
            navigate('/my-friends');
          }}
        >
          Friends
        </button>

        <button
          className={`top-tab ${activeMainTab === 'ranks' ? 'is-active' : ''}`}
          onClick={() => setActiveMainTab('ranks')}
        >
          Ranks
        </button>
      </div>

      {/* ---------------------------------------- */}


      {stats && (
        <section>
          <h2>{t('myStatistics') || 'My Statistics'}</h2>
          <ul>
            <li><strong>Name:</strong> {stats.name}</li>
            <li><strong>Total Trainings:</strong> {stats.totalTrainings}</li>
            <li><strong>Challenge Win Rate:</strong> {(stats.challengeWinRate * 100).toFixed(1)}%</li>
            <li><strong>Longest Streak:</strong> {stats.longestStreak} {t('days') || 'days'}</li>
            <li><strong>Current Streak:</strong> {stats.currentStreak} {t('days') || 'days'}</li>
            <li><strong>{t('averageDifficulty') || 'Average Difficulty'}:</strong> {stats.averageDifficulty.toFixed(2)}</li>
            <li><strong>Total Training Time:</strong> {stats.totalTrainingTime} {t('minutes') || 'minutes'}</li>
          </ul>
        </section>
      )}

      {/* ---------- Tabs ---------- */}
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="ranking-tab"
            aria-selected={activeTab === tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ---------- Tab Panel ---------- */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {loadingTabs[activeTab] && (
          <p className="info-text">{t('loading') || 'Loading'}…</p>
        )}
        {errorTabs[activeTab] && (
          <p className="error-text">Error: {errorTabs[activeTab]}</p>
        )}

        {/* Global / Monthly / Streaks */}
        {!loadingTabs[activeTab] && !errorTabs[activeTab] && isRankingResponse(rankings[activeTab]) && (
          <>
            <ol className="ranking-list">
              {rankings[activeTab]!.entries.map((entry) => (
                <li key={entry.username}>
                  <span>{entry.displayName ?? entry.username}</span>
                  <span>{entry.score} {t('points') || 'points'}</span>
                </li>
              ))}
            </ol>
            <p className="info-text">
              {t('lastUpdate') || 'Last Update'}:{' '}
              {new Date(rankings[activeTab]!.lastUpdated).toLocaleString()}
            </p>
          </>
        )}

        {/* Friends Tab */}
        {!loadingTabs[activeTab] && !errorTabs[activeTab] && activeTab === 'friends' &&
          (rankings.friends as FriendRankingResponse)?.friends?.length > 0 && (
            <>
              <ol className="ranking-list">
                {(rankings.friends as FriendRankingResponse).friends.map(
                  (entry: FriendRankingEntry) => (
                    <li key={entry.username}>
                      <span>{entry.displayName ?? entry.username}</span>
                      <span>{entry.score} {t('days') || 'days'}</span>
                    </li>
                  )
                )}
              </ol>
              <p className="info-text">{t('lastUpdate') || 'Last Update'}: n/a</p>
            </>
          )}
      </div>
    </main>
  );
};

export default Ranking;
