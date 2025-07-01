import { useEffect, useState } from "react";
import { acceptChallenge, createChallenge, type Challenge } from "../api/challenges";

const MyChallenges: React.FC = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [friends, setFriends] = useState<string[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [opponentUsername, setOpponentUsername] = useState('');
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    const[error, setError] = useState<string | null>(null);
    const[success, setSuccess] = useState<string | null>(null);

    const loadData = async() => {
        try{
            const[challengeData, friendsData, gamesData] await Promise.all([
                getMyChallenges(),
                getFriends(),
                getAllFriends(),
            ]);

            setChallenges(challengeData);
            setFriends(friendsData.map((f: any) => f.username));
            setGames(gamesData);
        } 
        catch (error) {
            setError('Error loading the data');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateChallenge = async () => {
        if (!opponentUsername || selectedGameId === null){
            setError('Please choose a game.');
            return;
        }

        try{
            const newChallenge = await createChallenge(opponentUsername, setSelectedGameId);
            setChallenges([...challenges, newChallenge]);
            setSuccess('Challenge was created.');
            setOpponentUsername('');
            setSelectedGameId(null);
        }
        catch (error) {
            setError('Create new Challenge failed');
        }
    };

    const handleAccept = async (id: number) => {
        try {
            const updated = await acceptChallenge(id);
            setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
        }
        catch {
            setError('Error rejecting challenge');
        }
    };

    return(
        <div>
            <h2>My Challenges</h2>
        </div>
    )
    }
