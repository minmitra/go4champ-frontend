import { useEffect, useState } from 'react';
import './MyChallenges.css';
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
} from '../api/challenges';
import { getFriend } from '../api/friendship';
import { useNavigate } from 'react-router-dom';

const MyChallenges: React.FC = () => {
  /* ---------------------------------------------------------------- */
  /*  STATE                                                           */
  /* ---------------------------------------------------------------- */
  const [challenges, setChallenges] = useState<ChallengeResponse[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [opponentUsername, setOpponentUsername] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChallengeType>('FREE');
  const [deadline, setDeadline] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resultValues, setResultValues] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  /* ---------- Haupt-Tab-Leiste ---------- */
  const [activeMainTab, setActiveMainTab] =
    useState<'challenges' | 'friends' | 'ranks'>('challenges');

  /* ---------------------------------------------------------------- */
  /*  FETCH                                                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [challengeData, friendsData] = await Promise.all([
        getMyChallenges(),
        getFriend(),
      ]);
      setChallenges(challengeData);
      setFriends(friendsData.map((f: any) => f.username));
    } catch {
      setError('Error loading the data');
    }
  };

  /* ---------------------------------------------------------------- */
  /*  TIMEOUT für Meldungen                                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(null); setSuccess(null); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  /* ---------------------------------------------------------------- */
  /*  HANDLER (Create / Accept / …)                                   */
  /* ---------------------------------------------------------------- */
  const handleCreateChallenge = async () => {
    setError(null); setSuccess(null);
    if (!opponentUsername) { setError('Please choose an opponent.'); return; }
    if (!title.trim())     { setError('Please enter a title.');      return; }

    try {
      const newChallenge = await createChallenge({
        challengedUsername: opponentUsername,
        title,
        description,
        type,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });
      setChallenges([...challenges, newChallenge]);
      setSuccess('Challenge was created.');
      setOpponentUsername(''); setTitle(''); setDescription(''); setType('FREE'); setDeadline('');
    } catch (e: any) {
      setError(e.message || 'Creating new Challenge failed');
    }
  };

  const handleAccept  = async (id: number) => { try { const u = await acceptChallenge(id);  setChallenges(p => p.map(c => c.id === id ? u : c)); } catch { setError('Error accepting challenge'); } };
  const handleReject  = async (id: number) => { try { await rejectChallenge(id); setChallenges(p => p.filter(c => c.id !== id)); setSuccess('Challenge rejected and removed.'); } catch { setError('Error rejecting challenge'); } };
  const handleCancel  = async (id: number) => { try { await cancelChallenge(id); setChallenges(p => p.filter(c => c.id !== id)); setSuccess('Challenge canceled.'); } catch { setError('Error canceling challenge'); } };

  const handleSubmitResult = async (c: ChallengeResponse) => {
    const val = resultValues[c.id];
    if (!val || isNaN(parseFloat(val))) { setError('Please enter a valid numeric result'); return; }
    try {
      const updated = await submitChallengeResult(c.id, parseFloat(val));
      setChallenges(p => p.map(ch => ch.id === c.id ? updated : ch));
      setSuccess('Result submitted.'); setResultValues(p => ({ ...p, [c.id]: '' }));
    } catch (e: any) { setError(e.message || 'Error submitting result'); }
  };

  const handleDeclareWinner = async (
    c: ChallengeResponse,
    winnerUsername: 'challenger' | 'challenged' | 'tie',
    reason = ''
  ) => {
    try {
      const updated = await declareWinner(c.id, winnerUsername, reason);
      setChallenges(p => p.map(ch => ch.id === c.id ? updated : ch));
      setSuccess('Sieger wurde bestimmt.');
    } catch (e: any) { setError(e.message || 'Fehler beim Bestimmen des Siegers'); }
  };

  const username = localStorage.getItem('username') || '';
  const roleLabel = (r: string) => (r === 'CHALLENGER' ? 'Challenger' : r === 'CHALLENGED' ? 'Challenged' : r);

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <main>
      {/* ======= HORIZONTALE HAUPT-TABBAR ======= */}
      <div className="top-tabbar">
        <button
          className={`top-tab ${activeMainTab === 'challenges' ? 'is-active' : ''}`}
          onClick={() => setActiveMainTab('challenges')}
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
          onClick={() => {
            setActiveMainTab('ranks');
            navigate('/ranking');
          }}
        >
          Ranks
        </button>
      </div>

      {/* ---------------------------------------- */}


      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      {/* -------- Create Challenge -------- */}
      <section>
        <h2>Challenge your friends</h2>
        <p>Create a new Challenge:</p>

        <select value={opponentUsername} onChange={e => setOpponentUsername(e.target.value)}>
          <option value="">Choose Friend</option>
          {friends.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

        <select value={type} onChange={e => setType(e.target.value as ChallengeType)}>
          <option value="FREE">Free</option>
          <option value="REPS">Reps</option>
          <option value="WEIGHT">Weight</option>
        </select>

        <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />

        <button className="primary-button" onClick={handleCreateChallenge}>Send</button>
      </section>

      {/* -------- OPEN Challenges -------- */}
      <section>
        <h2>Open Challenges</h2>
        {challenges.length === 0 ? (
          <p>No Challenges.</p>
        ) : (
          challenges.map(c => (
            <div key={c.id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 12 }}>
              <p><strong>{c.challengerUsername}</strong> vs <strong>{c.challengedUsername}</strong></p>
              <p>Title: {c.title ?? ''}</p>
              <p>My Role: {roleLabel(c.myRole)}</p>
              <p>Status: <em>{c.status}</em></p>
              <p>Type: {c.type}</p>

              {/* Buttons für PENDING */}
              {c.status === 'PENDING' && c.myRole === 'CHALLENGED' && (
                <div>
                  <button onClick={() => handleAccept(c.id)}>Accept</button>
                  <button onClick={() => handleReject(c.id)}>Reject</button>
                </div>
              )}

              {c.status === 'PENDING' && c.myRole === 'CHALLENGER' && (
                <button onClick={() => handleCancel(c.id)}>Cancel</button>
              )}

              {/* Ergebnis einreichen */}
              {c.status === 'ACCEPTED' && (c.type === 'REPS' || c.type === 'WEIGHT') &&
                !((c.myRole === 'CHALLENGER' && c.challengerSubmitted) || (c.myRole === 'CHALLENGED' && c.challengedSubmitted)) && (
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={`Dein Ergebnis (${c.targetUnit || ''})`}
                      value={resultValues[c.id] ?? ''}
                      onChange={e => setResultValues(p => ({ ...p, [c.id]: e.target.value }))}
                    />
                    <button onClick={() => handleSubmitResult(c)}>Ergebnis einreichen</button>
                  </div>
                )}

              {/* Gewinner wählen (FREE) */}
              {c.status === 'ACCEPTED' && c.type === 'FREE' && username === c.challengerUsername &&
                ((c.myRole === 'CHALLENGER' && !c.challengerResult) || (c.myRole === 'CHALLENGED' && !c.challengedResult)) && (
                  <div>
                    <p>Wer hat deiner Meinung nach gewonnen?</p>
                    <button onClick={() => handleDeclareWinner(c, 'challenger')}>Ich habe gewonnen</button>
                    <button onClick={() => handleDeclareWinner(c, 'challenged')}>Gegner hat gewonnen</button>
                    <button onClick={() => handleDeclareWinner(c, 'tie')}>Unentschieden</button>
                  </div>
                )}

              {/* Gewinner anzeigen */}
              {c.status === 'COMPLETED' && (
                <p>Winner: <strong>{c.winnerName || 'Not set'}</strong></p>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default MyChallenges;
