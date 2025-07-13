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
  getFriendMonthlyRanking,
  isRankingResponse,
  type UserStats,
  type RankingResponse,
  type FriendRankingResponse,
  type FriendRankingEntry,
  getMyStats,
} from '../api/rankings';

import { FaGlobe, FaCalendarAlt, FaFire, FaUserFriends } from 'react-icons/fa';
import { t } from 'i18next';

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

function formatLastUpdated(dateString?: string | null): string {
  if (!dateString) return t('updated');
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return t('updated');

  return (
    d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' ' +
    d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );
}



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
  const [myStats, setMyStats] = useState<UserStats | null>(null);


  /* ---------- Fetch Overview (once) ---------- */
  useEffect(() => {
  (async () => {
    try {
      const overview = await getRankingOverview();
      const stats = await getMyStats(); // 👈 hier hinzufügen
      setOverviewData(overview);
      setMyStats(stats); // 👈 speichern
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
            console.log("Global Trainings Ranking data:", data);
            break;
          case 'monthly':
            data = await getFriendMonthlyRanking();
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
        console.log(`Data for tab ${activeTab}:`, data);
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
          <h2>Statistics</h2>
          <ul>
            <li><strong>Name:</strong> {stats.name}</li>
            <li><strong>Total Trainings:</strong> {stats.totalTrainings}</li>
            <li><strong>Challenge Win Rate:</strong> {(stats.challengeWinRate * 100).toFixed(1)}%</li>
            <li><strong>Longest Streak:</strong> {stats.longestStreak} {t('days') || 'days'}</li>
            <li><strong>Current Streak:</strong> {stats.currentStreak} {t('days') || 'days'}</li>
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

        {/* Global / Streaks */}
        {!loadingTabs[activeTab] && !errorTabs[activeTab] && isRankingResponse(rankings[activeTab]) && (
        <>
          {rankings[activeTab]!.entries.length === 0 ? (
            <p className="info-text">No entry yet!</p>
          ) : (
            <ol className="ranking-list">
              {rankings[activeTab]!.entries.map((entry) => (
                <li key={entry.username} className={entry.username === myStats?.username ? 'highlight-me' : ''}>
                  <span>{entry.displayName ?? entry.username}</span>
                  <span>{entry.score}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="info-text">
            {'last update'}: {formatLastUpdated(rankings[activeTab]?.lastUpdated)}
          </p>

        </>
      )}


        {/* Monthly Tab */}
        {!loadingTabs[activeTab] && !errorTabs[activeTab] && activeTab === 'monthly' && (rankings[activeTab] as any)?.friendEntries?.length > 0 && (
          <>
            <ol className="ranking-list">
              {(rankings[activeTab] as any).friendEntries.map((entry: any) => (
                <li key={entry.username} className={entry.username === myStats?.username ? 'highlight-me' : ''}>
                  <span>{entry.name && entry.name.length > 0 ? entry.name : entry.username}</span>
                  <span>{entry.value} {t('points') || 'points'}</span>
                </li>
              ))}
            </ol>
            <p className="info-text">
              {(formatLastUpdated((rankings[activeTab] as any)?.lastUpdated) || (rankings[activeTab] as any)?.period) ?? 'n/a' }
            </p>

          </>
        )}



        {/* Friends Tab */}
        {!loadingTabs[activeTab] &&
          !errorTabs[activeTab] &&
          activeTab === 'friends' &&
          (rankings[activeTab] as any)?.friendEntries?.length > 0 && (
            <>
              <ol className="ranking-list">
                {(rankings[activeTab] as any).friendEntries.map((entry: any) => (
                  <li key={entry.username} className={entry.username === myStats?.username ? 'highlight-me' : ''}>
                    <span>{entry.name?.length > 0 ? entry.name : entry.username}</span>
                    <span>{entry.value} {t('days') || 'days'}</span>
                  </li>
                ))}
              </ol>
              <p className="info-text">
                {(formatLastUpdated((rankings[activeTab] as any)?.lastUpdated) || (rankings[activeTab] as any)?.period) ?? 'n/a' }
              </p>


            </>
        )}



      </div>
    </main>
  );
};

export default Ranking;
