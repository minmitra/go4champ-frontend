import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
  getRankingOverview,
  getGlobalTrainingRanking,
  getMonthlyTrainingRanking,
  getStreakRanking,
  getFriendStreakRanking,
  type UserStats,
  type RankingResponse,
  type FriendRankingResponse,
  type RankingEntry,
  type FriendRankingEntry,
  isRankingResponse
} from "../api/rankings";

type TabId = "trainings" | "monthly" | "streaks" | "friends";

const tabs: { id: TabId; label: string }[] = [
  { id: "trainings", label: "Global" },
  { id: "monthly", label: "Monthly" },
  { id: "streaks", label: "Streaks" },
  { id: "friends", label: "Friends" },
];

export const Ranking: React.FC = () => {
  const [overviewData, setOverviewData] = useState<{
    recentAchievements: any[];
    upcomingMilestones: any[];
    currentUserStats: UserStats;
  } | null>(null);

  // Rankings: Trainings, Monthly, Streaks use RankingResponse, Friends uses FriendRankingResponse
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

  const [activeTab, setActiveTab] = useState<TabId>("trainings");
  const navigate = useNavigate();

  // Übersicht laden
  useEffect(() => {
    async function fetchOverview() {
      try {
        const overview = await getRankingOverview();
        setOverviewData(overview);
      } catch (err) {
        console.error("Error fetching overview:", err);
      }
    }
    fetchOverview();
  }, []);

  // Ranking für aktiven Tab laden
  useEffect(() => {
    async function fetchRanking(tabId: TabId) {
      setLoadingTabs((prev) => ({ ...prev, [tabId]: true }));
      setErrorTabs((prev) => ({ ...prev, [tabId]: null }));

      try {
        let data: RankingResponse | FriendRankingResponse;

        switch (tabId) {
          case "trainings":
            data = await getGlobalTrainingRanking(10);
            break;
          case "monthly":
            data = await getMonthlyTrainingRanking(10);
            break;
          case "streaks":
            data = await getStreakRanking(10);
            break;
          case "friends":
            data = await getFriendStreakRanking();
            break;
          default:
            throw new Error("Unknown tab");
        }

        setRankings((prev) => ({ ...prev, [tabId]: data }));
      } catch (err) {
        setErrorTabs((prev) => ({ ...prev, [tabId]: (err as Error).message }));
      } finally {
        setLoadingTabs((prev) => ({ ...prev, [tabId]: false }));
      }
    }

    // Wenn noch keine Daten für den aktiven Tab, lade sie
    if (!rankings[activeTab]) {
      fetchRanking(activeTab);
    }
  }, [activeTab, rankings]);

  const stats = overviewData?.currentUserStats;

  return (
    <main>
      {stats && (
        <section>
          <h2>My Statistics</h2>
          <ul>
            <li>
              <strong>Name:</strong> {stats.name}
            </li>
            <li>
              <strong>Total Trainings:</strong> {stats.totalTrainings}
            </li>
            <li>
              <strong>Challenge Win Rate:</strong>{" "}
              {(stats.challengeWinRate * 100).toFixed(1)}%
            </li>
            <li>
              <strong>Longest Streak:</strong> {stats.longestStreak} Tage
            </li>
            <li>
              <strong>Current Streak:</strong> {stats.currentStreak} Tage
            </li>
            <li>
              <strong>Durchschnittliche Schwierigkeit:</strong>{" "}
              {stats.averageDifficulty.toFixed(2)}
            </li>
            <li>
              <strong>Total Training time:</strong> {stats.totalTrainingTime} Minuten
            </li>
          </ul>
        </section>
      )}

      <section>
        <div style={{ marginBottom: 16 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontWeight: activeTab === tab.id ? "bold" : "normal",
                marginRight: 12,
                padding: "8px 16px",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.id ? "3px solid blue" : "3px solid transparent",
                background: "none",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                outline: "none",
              }}
              aria-selected={activeTab === tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {loadingTabs[activeTab] && (
            <p>Loading {tabs.find((t) => t.id === activeTab)?.label}...</p>
          )}
          {errorTabs[activeTab] && (
            <p style={{ color: "red" }}>Error: {errorTabs[activeTab]}</p>
          )}

          {!loadingTabs[activeTab] &&
            !errorTabs[activeTab] &&
            isRankingResponse(rankings[activeTab]) && (
              <>
                <ol>
                  {rankings[activeTab].entries.map((entry) => (
                    <li key={entry.username}>
                      <strong>{entry.displayName ?? entry.username}</strong> – Points:{" "}
                      {entry.score}
                    </li>
                  ))}
                </ol>
                <p>
                  Last Update:{" "}
                  {new Date(rankings[activeTab].lastUpdated).toLocaleString()}
                </p>
              </>
            )}


            {!loadingTabs[activeTab] &&
            !errorTabs[activeTab] &&
            activeTab === "friends" &&
            (rankings.friends as FriendRankingResponse)?.friends?.length > 0 && (
              <>
                <ol>
                  {(rankings.friends as FriendRankingResponse).friends.map(
                    (entry: FriendRankingEntry) => (
                      <li key={entry.username}>
                        <strong>{entry.displayName ?? entry.username}</strong> – Streak:{" "}
                        {entry.score} Tage
                      </li>
                    )
                  )}
                </ol>
                <p>Last Update: n/a</p>
              </>
            )}
          </div>
      </section>

      <div className="navigation-buttons" style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/my-friends")}
          className="navigation-button"
        >
          <FaAngleLeft className="left-icon" /> Go to my friends
        </button>
        <button
          onClick={() => navigate("/challenges")}
          className="navigation-button right-align"
        >
          Go to challenges <FaAngleRight className="right-icon" />
        </button>
      </div>
    </main>
  );
};

export default Ranking;
