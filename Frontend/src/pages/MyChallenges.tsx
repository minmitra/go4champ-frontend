import { useEffect, useState } from "react";
import { 
  getMyChallenges, 
  rejectChallenge, 
  acceptChallenge, 
  createChallenge, 
  type ChallengeResponse, 
  type ChallengeType, 
  cancelChallenge, 
  submitChallengeResult, 
  declareWinner, 
  type CreateChallengeRequest
} from "../api/challenges";
import { getFriend } from "../api/friendship";
import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import './MyChallenges.css'

const MyChallenges: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<"challenges" | "friends" | "ranks">("challenges");
  const [challenges, setChallenges] = useState<ChallengeResponse[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [opponentUsername, setOpponentUsername] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetUnit, setTargetUnit] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");

  const [type, setType] = useState<ChallengeType | "">("");
  const [deadline, setDeadline] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resultValues, setResultValues] = useState<Record<number,{ reps?: string; weight?: string; note?: string }>>({}); 
  const navigate = useNavigate();

  //DEBUG
  const username = localStorage.getItem('username');
  console.log("Current username:", username);
  console.log("Current Opponent", opponentUsername);

  const roleLabel = (role: string) => {
  switch(role) {
    case "CHALLENGER": return "Challenger";
    case "CHALLENGED": return "Challenged";
    default: return role;
  }
};

  const loadData = async () => {
    try {
      const [challengeData, friendsData] = await Promise.all([
        getMyChallenges(),
        getFriend(),
      ]);

      console.log("Challenges from backend:", challengeData);

      setChallenges(challengeData);
      setFriends(friendsData.map((f: any) => f.username));
    } catch (error) {
      setError('Error loading the data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [error, success]);


  const handleCreateChallenge = async () => {
  setError(null);
  setSuccess(null);

  if (!opponentUsername) {
    setError("Please choose an opponent.");
    return;
  }

  if (!title.trim()) {
    setError("Please enter a title.");
    return;
  }

  if (!targetValue.trim() || isNaN(Number(targetValue))) {
    setError("Please enter a valid target value.");
    return;
  }

  if (!targetUnit.trim()) {
    setError("Please enter a target unit.");
    return;
  }

  if (!deadline.trim()) {
    setError("Please enter a deadline.");
    return;
  }

  const challengePayload: CreateChallengeRequest = {
    challengedUsername: opponentUsername,
    title,
    description,
    type: type as ChallengeType,
    targetValue: Number(targetValue),
    targetUnit,
    deadline: new Date(deadline).toISOString(),
  };

  try {
    const newChallenge = await createChallenge(challengePayload);
    setChallenges([...challenges, newChallenge]);
    setSuccess("Challenge was created.");

    // Reset form
    setOpponentUsername("");
    setTitle("");
    setDescription("");
    setType("FREE");
    setTargetUnit("");
    setTargetValue("");
    setDeadline("");
    } catch (error: any) {
      setError(error.message || "Creating new Challenge failed");
    }
  };


  const handleAccept = async (id: number) => {
    try {
      const updated = await acceptChallenge(id);
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch {
      setError('Error accepting challenge');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectChallenge(id);
      setChallenges((prev) => prev.filter((c) => (c.id !== id)));
      setSuccess("Challenge rejected and removed.")
    } catch {
      setError('Error rejecting challenge');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelChallenge(id);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Challenge canceled.");
    } catch {
      setError("Error canceling challenge");
    }
  };

  const handleDeclareWinner = async (
    c: ChallengeResponse,
    winnerUsername: "challenger" | "challenged" | "tie",
    reason: string = ""
  ) => {
    try {
      console.log("Declare winner:", { id: c.id, winnerUsername, reason });
      console.log("Winner info:", c.winnerUsername, c.winnerName);
      const updated = await declareWinner(c.id, winnerUsername, reason);
      console.log("Updated challenge after declareWinner:", updated);


      console.log("Declare-Winner Response:", updated);

      setChallenges((prev) =>
        prev.map((ch) => (ch.id === c.id ? updated : ch))
      );
      setSuccess("Sieger wurde bestimmt.");
    } catch (error: any) {
      setError(error.message || "Fehler beim Bestimmen des Siegers");
    }
  };

  const handleSubmitResult = async (c: ChallengeResponse) => {
  const vals = resultValues[c.id];

  if (!vals) {
    setError("Bitte gib dein Ergebnis ein.");
    return;
  }

  try {
    let result: number;
    if (c.type === "REPS") {
      if (!vals.reps || isNaN(parseFloat(vals.reps))) {
        setError("Bitte gültige Wiederholungen angeben.");
        return;
      }
      result = parseFloat(vals.reps);
    } else if (c.type === "WEIGHT") {
      if (!vals.weight || isNaN(parseFloat(vals.weight))) {
        setError("Bitte gültiges Gewicht angeben.");
        return;
      }
      result = parseFloat(vals.weight);
    } else if (c.type === "FREE") {
      result = 0;
    } else {
      setError("Unbekannter Challenge-Typ");
      return;
    }

    const updated = await submitChallengeResult(c.id, {
      result,
      comment: vals.note || ""
    });

    setChallenges((prev) =>
      prev.map((ch) => (ch.id === c.id ? updated : ch))
    );
    setSuccess("Ergebnis gespeichert");

    const bothSubmitted =
      updated.challengerSubmitted && updated.challengedSubmitted;
    const winnerAlreadySet = !!updated.winnerUsername;

    if (bothSubmitted && !winnerAlreadySet) {
      let winner: "challenger" | "challenged" | "tie";

      if (updated.challengerResult === updated.challengedResult) {
        winner = "tie";
      } else if (
        (updated.type === "REPS" ||
          updated.type === "WEIGHT" ||
          updated.type === "FREE") &&
        updated.challengerResult! > updated.challengedResult!
      ) {
        winner = "challenger";
      } else if (
        updated.type === "TIME" &&
        updated.challengerResult! < updated.challengedResult!
      ) {
        winner = "challenger";
      } else {
        winner = "challenged";
      }

      try {
        const winnerResult = await declareWinner(updated.id, winner);
        setChallenges((prev) =>
          prev.map((ch) => (ch.id === updated.id ? winnerResult : ch))
        );
        setSuccess("Sieger automatisch ermittelt.");
      } catch (error: any) {
        console.error("Fehler beim automatischen Sieger bestimmen:", error);
      }
    }
  } catch (error: any) {
    setError(error.message || "Fehler beim Einreichen des Ergebnisses.");
  }
};

    


  return(  
    <main>
      <div className="top-tabbar">
  <button
    className={`top-tab ${activeMainTab === "challenges" ? "is-active" : ""}`}
    onClick={() => setActiveMainTab("challenges")}
  >
    Challenges
  </button>
  <button
    className={`top-tab ${activeMainTab === "friends" ? "is-active" : ""}`}
    onClick={() => {
      setActiveMainTab("friends");
      navigate("/my-friends");
    }}
  >
    Friends
  </button>
  <button
    className={`top-tab ${activeMainTab === "ranks" ? "is-active" : ""}`}
    onClick={() => {
      setActiveMainTab("ranks");
      navigate("/ranking");
    }}
  >
    Ranks
  </button>
</div>

      <div>
        {/* <div className="navigation-buttons">
          <button onClick={() => navigate('/my-friends')} className="navigation-button">
            Friends 
          </button>
          <button onClick={() => navigate('/ranking')} className="navigation-button">
            Ranks 
          </button>
        </div> */}

        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}

        <section>
          <h2>Challenge your friends</h2>
          <p>Create a new Challenge:</p>
          <select value={opponentUsername} onChange={(e) => setOpponentUsername(e.target.value)}>
            <option value="">Choose Friend</option>
            {friends.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            )
          )}
          </select>

          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          
          <select value={type} onChange={(e) => setType(e.target.value as ChallengeType)}>
            <option value="" disabled>Select Type</option>
            <option value="FREE">Free</option>
            <option value="REPS">Reps</option>
            <option value="WEIGHT">Weight</option>
          </select>

          
          {(type === "REPS" || type === "WEIGHT") && (
            <>
              <input
                type="number"
                placeholder={type === "REPS" ? "Ziel-Wiederholungen" : "Ziel-Gewicht (kg)"}
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
              <input
                type="text"
                placeholder="Einheit (z.B. kg, reps)"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
              />
            </>
          )}
          
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <button className="primary-button" onClick={handleCreateChallenge}>Send</button>
        
        </section>

        <section>
          <h2>Open Challenges</h2>
          {challenges.length === 0 ? (
            <p>No Challenges.</p>
            ) : 
            (
              challenges.map((c) => (
                <div key={c.id} style={{ border: "1px solid #ccc", padding: 8, marginBottom: 12 }}>
                  <p>
                    <strong>{c.challengerUsername}</strong> vs <strong>{c.challengedUsername}</strong>
                  </p>
                  <p>Title: {c.title ?? ""}</p>
                  <p>My Role: {roleLabel(c.myRole)}</p>
                  <p>Status: <em>{c.status}</em></p>
                  <p>Type: {c.type}</p>

                  {/* Buttons für PENDING */}
                  {c.status === "PENDING" && c.myRole === "CHALLENGED" && (
                    <div>
                      <button onClick={() => handleAccept(c.id)}>Accept</button>
                      <button onClick={() => handleReject(c.id)}>Reject</button>
                    </div>
                  )}

                  {c.status === "PENDING" && c.myRole === "CHALLENGER" && (
                    <button onClick={() => handleCancel(c.id)}>Cancel</button>
                  )}

                  {c.status === "ACCEPTED" && (
                    <div>
                      {(c.type === "REPS" || c.type === "WEIGHT") && !((c.myRole === "CHALLENGER" && c.challengerSubmitted) || (c.myRole === "CHALLENGED" && c.challengedSubmitted)) && (
                        <div>
                          {c.type === "REPS" && (
                            <input
                              type="number"
                              placeholder="Wiederholungen"
                              value={resultValues[c.id]?.reps || ""}
                              onChange={(e) =>
                                setResultValues((prev) => ({
                                  ...prev,
                                  [c.id]: { ...prev[c.id], reps: e.target.value },
                                }))
                              }
                            />
                          )}
                          {c.type === "WEIGHT" && (
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Gewicht (kg)"
                              value={resultValues[c.id]?.weight || ""}
                              onChange={(e) =>
                                setResultValues((prev) => ({
                                  ...prev,
                                  [c.id]: { ...prev[c.id], weight: e.target.value },
                                }))
                              }
                            />
                          )}
                          <button onClick={() => handleSubmitResult(c)}>Ergebnis einreichen</button>
                        </div>
                      )}

                      {c.type === "FREE" && !((c.myRole === "CHALLENGER" && c.challengerResult) || (c.myRole === "CHALLENGED" && c.challengedResult)) && (
                        <div>
                          <input
                            type="text"
                            placeholder="Was hast du geschafft? (optional)"
                            value={resultValues[c.id]?.note || ""}
                            onChange={(e) =>
                              setResultValues((prev) => ({
                                ...prev,
                                [c.id]: { ...prev[c.id], note: e.target.value },
                              }))
                            }
                          />
                          <button onClick={() => handleSubmitResult(c)}>Speichern</button>
                        </div>
                      )}

                      {c.type === "FREE" && username === c.challengerUsername && !c.winnerName && (
                        <div>
                          <p>Wer hat deiner Meinung nach gewonnen?</p>
                          <button onClick={() => handleDeclareWinner(c, "challenger")}>Ich habe gewonnen</button>
                          <button onClick={() => handleDeclareWinner(c, "challenged")}>Gegner hat gewonnen</button>
                          <button onClick={() => handleDeclareWinner(c, "tie")}>Unentschieden</button>
                        </div>
                      )}



                      {/* {c.status === "COMPLETED" && (
                        <>
                          {console.log("WinnerName:", c.winnerName, "WinnerUsername:", c.winnerUsername)}
                          <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#e0ffe0", borderRadius: "4px" }}>
                            {c.winnerUsername === "tie" ? (
                              <span><strong>Unentschieden!</strong></span>
                            ) : (
                              <span>Winner: <strong>{c.winnerName ?? c.winnerUsername}</strong></span>
                            )}
                          </div>
                        </>
                      )} */}

                    </div>
                  ) || (
                    <div>
                      {c.status === "COMPLETED" && (
                        <div style={{ background: "#ffe0e0", padding: "0.5rem" }}>
                          <p><strong>DEBUG</strong></p>
                          <p>WinnerName: {String(c.winnerName)}</p>
                          <p>WinnerUsername: {String(c.winnerUsername)}</p>
                        </div>
                      )}
                    </div>
                  )}    
                </div>
              ))
            )
          }
        </section>
      </div>
    </main>
  );
};

export default MyChallenges;