import { useEffect, useState } from "react";
import { getMyChallenges, rejectChallenge, acceptChallenge, createChallenge, type Challenge } from "../api/challenges";
import { getFriend } from "../api/friendship";
import { useNavigate } from "react-router-dom";

const MyChallenges: React.FC = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [friends, setFriends] = useState<string[]>([]);
    const [opponentUsername, setOpponentUsername] = useState('');
    const [message, setMessage] = useState('');
    const[error, setError] = useState<string | null>(null);
    const[success, setSuccess] = useState<string | null>(null);
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

        try{
            const newChallenge = await createChallenge(opponentUsername, message);
            setChallenges([...challenges, newChallenge]);
            setSuccess('Challenge was created.');
            setOpponentUsername("");
            setMessage("null");
        }
        catch (error) {
            setError('Creating new Challenge failed');
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


    return(
        <div>
            <h2>My Challenges</h2>

            {/*Navigation zu MyFriends.tsx*/}
            <button onClick={() => navigate("/my-friends")}>Go to Friends</button>

            {error && <div>{error}</div>}
            {success && <div>{success}</div>}

            <div>
                <h3>Create new Challenge</h3>
                <div>
                    <select
                        value={opponentUsername}
                        onChange={(e) => setOpponentUsername(e.target.value)}
                    >
                        <option value="">Choose Friend</option>
                        {friends.map((friend) => (
                            <option key={friend} value={friend}>
                                {friend}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Leave a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleCreateChallenge}>Send</button>
                </div>
            </div>

            <div>
                <h3>Open Challenges</h3>
                {challenges.length === 0 ? (
                    <p>No Challenges.</p>
                ) : (
                    challenges.map((challenge) => (
                        <div key={challenge.id}>
                            <div>
                                <p>
                                    <strong>{challenge.challengerUsername}</strong> vs <strong>{challenge.opponentUsername}</strong>
                                </p>
                                <p>Game: {challenge.gameName}</p>
                                <p>Status: <em>{challenge.status}</em></p>
                            </div>

                            {challenge.status === 'PENDING' && challenge.opponentUsername === localStorage.getItem('username') && (
                                <div>
                                    <button onClick={() => handleAccept(challenge.id)}>Accept</button>
                                    <button onClick={() => handleReject(challenge.id)}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyChallenges;
