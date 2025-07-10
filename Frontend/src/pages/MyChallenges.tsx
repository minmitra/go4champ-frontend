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
  declareWinner 
} from "../api/challenges";
import { getFriend } from "../api/friendship";
import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

const MyChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<ChallengeResponse[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [opponentUsername, setOpponentUsername] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ChallengeType>("FREE");
  const [deadline, setDeadline] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resultValues, setResultValues] = useState<Record<number, string>>({}); // für Ergebnis je Challenge
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
      setError('Please choose an opponent.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    // DEBUG
    const challengePayload = {
      challengedUsername: opponentUsername,
      title,
      description,
      type,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };
    console.log("Sending challenge payload:", challengePayload);

    try {
      const newChallenge = await createChallenge(challengePayload);

      setChallenges([...challenges, newChallenge]);
      setSuccess("Challenge was created.");

      setOpponentUsername("");
      setTitle("");
      setDescription("");
      setType("FREE");
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

  // Ergebnis einreichen für REPS und WEIGHT
 const handleSubmitResult = async (c: ChallengeResponse) => {
  const val = resultValues[c.id];
  if (!val || isNaN(parseFloat(val))) {
    setError("Please enter a valid numeric result");
    return;
  }

  try {
    const parsedVal = parseFloat(val);
    const updated = await submitChallengeResult(c.id, parsedVal);

    console.log("Backend response after submitting result:", updated); // <--- hier

    setChallenges((prev) => prev.map((ch) => (ch.id === c.id ? updated : ch)));
    setSuccess("Result submitted.");
    setResultValues((prev) => ({ ...prev, [c.id]: '' }));
  } catch (error: any) {
    setError(error.message || "Error submitting result");
  }
};


  // Gewinner deklarieren für FREE
  const handleDeclareWinner = async (c: ChallengeResponse, winnerUsername: "challenger" | "challenged" | "tie", reason: string="") => {
  try {
    console.log("Declare winner:", { id: c.id, winnerUsername, reason });
    const updated = await declareWinner(c.id, winnerUsername, reason);

    console.log("Declare-Winner Response:", updated);

    setChallenges((prev) =>
      prev.map((ch) => (ch.id === c.id ? updated : ch))
    );
    setSuccess("Sieger wurde bestimmt.");
  } catch (error: any) {
    setError(error.message || "Fehler beim Bestimmen des Siegers");
  }
};


    return(  
      <main>
        <div>
            <div className="navigation-buttons">
          <button onClick={() => navigate('/my-friends')} className="navigation-button">
           Friends 
          </button>
          <button onClick={() => navigate('/ranking')} className="navigation-button">
          Ranks 
          </button>
        </div>
   
          <h1>Challenges</h1>


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
            ))}
          </select>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <select value={type} onChange={(e) => setType(e.target.value as ChallengeType)}>
            <option value="FREE">Free</option>
            <option value="REPS">Reps</option>
            <option value="WEIGHT">Weight</option>
          </select>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <button className="primary-button" onClick={handleCreateChallenge}>Send</button>
        </section>

        <section>
          <h2>Open Challenges</h2>
          {challenges.length === 0 ? (
            <p>No Challenges.</p>
          ) : (
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

              

                {/* Gewinner manuell auswählen für FREE, nur wenn Gewinner noch nicht festgelegt */}
                {c.status === "ACCEPTED" && (c.type === "REPS" || c.type === "WEIGHT") &&
  (!((c.myRole === "CHALLENGER" && c.challengerSubmitted) ||
     (c.myRole === "CHALLENGED" && c.challengedSubmitted))) && (
    <div>
      <input
        type="number"
        step="0.01"
        placeholder={`Dein Ergebnis (${c.targetUnit || ""})`}
        value={resultValues[c.id] ?? ""}
        onChange={(e) =>
          setResultValues((prev) => ({ ...prev, [c.id]: e.target.value }))
        }
      />
      <button onClick={() => handleSubmitResult(c)}>Ergebnis einreichen</button>
    </div>
)}

{(c.status === "ACCEPTED" && c.type === "FREE") && (username === c.challengerUsername) &&  
  ((c.myRole === "CHALLENGER" && !c.challengerResult) ||
   (c.myRole === "CHALLENGED" && !c.challengedResult)) && (
    <div>
      <p>Wer hat deiner Meinung nach gewonnen?</p>
      <button onClick={() => handleDeclareWinner(c, "challenger", "")}>
        Ich habe gewonnen
      </button>
      <button onClick={() => handleDeclareWinner(c, "challenged", "")}>
        Gegner hat gewonnen
      </button>
      <button onClick={() => handleDeclareWinner(c, "tie", "")}>
        Unentschieden
      </button>
    </div>
)}

                {/* Gewinner anzeigen, wenn vorhanden */}
                {c.status === "COMPLETED" && (
                  <p>
                    Winner: <strong>{c.winnerName || "Not set"}</strong>
                  </p>
                )}

              </div>
            ))
          )}
        </section>

        
      </div>
    </main>
  );
};

export default MyChallenges;
