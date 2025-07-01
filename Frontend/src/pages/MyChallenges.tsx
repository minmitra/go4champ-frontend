import { useEffect, useState } from "react";
import { getMyChallenges, rejectChallenge, acceptChallenge, createChallenge, type Challenge, type ChallengeType, cancelChallenge, submitChallengeResult, declareWinner } from "../api/challenges";
import { getFriend } from "../api/friendship";
import { useNavigate } from "react-router-dom";

const MyChallenges: React.FC = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [friends, setFriends] = useState<string[]>([]);
    const [opponentUsername, setOpponentUsername] = useState('');
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<ChallengeType>("FREE");
    const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
    const [targetUnit, setTargetUnit] = useState("");
    const [deadline, setDeadline] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [resultValue, setResultValue] = useState("");
    const [selectedWinner, setSelectedWinner] = useState("");
    const navigate = useNavigate();

    const loadData = async() => {
        try{
            const[challengeData, friendsData] = await Promise.all([
                getMyChallenges(),
                getFriend(),
            ]);

            setChallenges(challengeData);
            setFriends(friendsData.map((f: any) => f.username));
        } 
        catch (error) {
            setError('Error loading the data');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateChallenge = async () => {
        setError(null);
        setSuccess(null);

        if (!opponentUsername){
            setError('Please choose an opponent.');
            return;
        }

        if (!title.trim()) {
            setError('Please enter a title.');
            return;
        }

        try {
            const newChallenge = await createChallenge({
            challengedUsername: opponentUsername,
            title,
            description,
            type,
            targetValue,
            targetUnit,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
        });

        setChallenges([...challenges, newChallenge]);
        setSuccess("Challenge was created.");

        setOpponentUsername("");
        setTitle("");
        setDescription("");
        setType("FREE");
        setTargetValue(undefined);
        setTargetUnit("");
        setDeadline("");
    } 
    catch (error: any) {
        setError(error.message || "Creating new Challenge failed");
    }
};

    const handleAccept = async (id: number) => {
        try {
            const updated = await acceptChallenge(id);
            setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
        }
        catch {
            setError('Error accepting challenge');
        }
    };

    const handleReject = async (id: number) => {
        try {
            const updated = await rejectChallenge(id);
            setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
        }
        catch {
            setError('Error rejecting challenge');
        }
    };

    const handleCancel = async (id: number) => {
    try {
      await cancelChallenge(id);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Challenge canceled.");
    } 
    catch {
      setError("Error canceling challenge");
    }
  };

  const handleSubmitResult = async (c: Challenge) => {
    try {
      const updated = await submitChallengeResult(c.id, parseFloat(resultValue), 0);
      setChallenges((prev) => prev.map((ch) => (ch.id === c.id ? updated : ch)));
      setSuccess("Result submitted.");
      setResultValue("");
    } catch {
      setError("Error submitting result");
    }
  };

  const handleDeclareWinner = async (c: Challenge) => {
    try {
      const updated = await declareWinner(c.id, selectedWinner);
      setChallenges((prev) => prev.map((ch) => (ch.id === c.id ? updated : ch)));
      setSuccess("Winner declared.");
      setSelectedWinner("");
    } catch {
      setError("Error declaring winner");
    }
  };


    return(
        <div>
            <h2>My Challenges</h2>

            {/*Navigation zu MyFriends.tsx*/}
            <button onClick={() => navigate("/my-friends")}>Go to Friends</button>

            {error && <div>{error}</div>}
            {success && <div>{success}</div>}

            <section>
        <h3>Create new Challenge</h3>
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
          <option value="TIME">Time</option>
        </select>
        <input
          type="number"
          placeholder="Target Value"
          value={targetValue ?? ""}
          onChange={(e) => setTargetValue(e.target.value ? parseFloat(e.target.value) : undefined)}
        />
        <input type="text" placeholder="Target Unit" value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)} />
        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button onClick={handleCreateChallenge}>Send</button>
      </section>

      <section>
        <h3>Open Challenges</h3>
        {challenges.length === 0 ? (
          <p>No Challenges.</p>
        ) : (
          challenges.map((c) => (
            <div key={c.id} className="challenge-card">
              <p>
                <strong>{c.challengerUsername}</strong> vs <strong>{c.opponentUsername}</strong>
              </p>
              <p>Title: {c.title ?? "–"}</p>
              <p>Status: <em>{c.status}</em></p>

              {c.status === "PENDING" &&
                c.opponentUsername === localStorage.getItem("username") && (
                  <div>
                    <button onClick={() => handleAccept(c.id)}>Accept</button>
                    <button onClick={() => handleReject(c.id)}>Reject</button>
                  </div>
                )}

              {c.status === "PENDING" &&
                c.challengerUsername === localStorage.getItem("username") && (
                  <button onClick={() => handleCancel(c.id)}>Cancel</button>
                )}

              {c.status === "ACCEPTED" && (
                <div>
                  <input
                    type="text"
                    placeholder="Your result"
                    value={resultValue}
                    onChange={(e) => setResultValue(e.target.value)}
                  />
                  <button onClick={() => handleSubmitResult(c)}>Submit Result</button>
                </div>
              )}

            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default MyChallenges;
