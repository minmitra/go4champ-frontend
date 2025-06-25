import React, { useEffect, useState } from 'react';
import './MyWorkout.css';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/fetchClient';

interface GeneratedExercise {
    title: string;
    duration: number; // Dauer in Minuten
    difficulty: number;
    typeString: string;
    description: string;
}

type WorkoutData = {
  bodyPart: string;
  exercises: string;
  location: string;
  workoutName: string;
  generatedExercises?: GeneratedExercise[];
  rawAiResponse?: string;
};

const defaultDummyExercises: GeneratedExercise[] = [
  { title: 'Default Squats', duration: 30, difficulty: 3.5, typeString: 'Indoor', description: 'Basic bodyweight squats.' },
  { title: 'Default Lunges', duration: 25, difficulty: 3.0, typeString: 'Outdoor', description: 'Alternating lunges for legs.' },
  { title: 'Default Plank', duration: 60, difficulty: 4.0, typeString: 'Indoor', description: 'Hold plank for core strength.' }
];

const MyWorkout = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WorkoutData>({
    bodyPart: '',
    exercises: '',
    location: '',
    workoutName: '',
    generatedExercises: undefined,
    rawAiResponse: undefined
  });
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>(() => {
    const saved = localStorage.getItem('savedWorkouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  const steps = ['bodyPart', 'exercises', 'location', 'summary'];
  const questions: Record<string, string> = {
    bodyPart: 'Which body part do you want to train?',
    exercises: 'How many exercises do you want in the workout?',
    location: 'Where are you right now?',
    summary: 'Ready to generate your workout plan?'
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  const handleEditClick = (index: number) => {
    setFormData(savedWorkouts[index]);
    setStep(0);
    setShowForm(true);
    setEditingIndex(index);
  };

  const handleStartClick = (index: number) => {
    const workout = savedWorkouts[index];
    if (!workout.workoutName) return;
    navigate(`/workoutdetail/${encodeURIComponent(workout.workoutName)}`, {
      state: { exercises: workout.generatedExercises || defaultDummyExercises }
    });
  };

  const handleDeleteClick = (index: number) => {
    setSavedWorkouts(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setShowForm(false);
      setEditingIndex(null);
      setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
      setStep(0);
    }
  };

  const handleSubmit = async () => {
    if (!formData.workoutName.trim()) return;
    if (editingIndex !== null) {
      setSavedWorkouts(prev => {
        const copy = [...prev];
        copy[editingIndex] = formData;
        return copy;
      });
      setEditingIndex(null);
      setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
      setStep(0);
      setShowForm(false);
      return;
    }
    setIsGenerating(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsGenerating(false);
      return;
    }
    try {
      const prompt = `Create a ${formData.exercises} exercises ${formData.bodyPart} workout plan for ${formData.location}.`;
      const response = await apiFetch<{ antwort: string; plan: string }>(`/ai/chat-create-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });
      let parsedExercises: GeneratedExercise[] = [];
      if (response.antwort) {
        const jsonMatch = response.antwort.match(/\[\s*\{.*?\}\s*(?:,\s*\{.*?\}\s*)*\]/s);
        if (jsonMatch && jsonMatch[0]) {
          parsedExercises = JSON.parse(jsonMatch[0]);
        } else {
          parsedExercises = defaultDummyExercises;
        }
      } else {
        parsedExercises = defaultDummyExercises;
      }
      const newWorkout: WorkoutData = {
        ...formData,
        generatedExercises: parsedExercises,
        rawAiResponse: response.antwort
      };
      setSavedWorkouts(prev => [newWorkout, ...prev]);
      setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
      setStep(0);
      setShowForm(false);
    } catch {
      // handle error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main>
      <div>
        <div>
          <h1>My Workout</h1>
interface WorkoutData {
    id: string; // Eindeutige ID
    workoutName: string;
    bodyPart: string;
    exercises: string; // Anzahl der Übungen (als String)
    location: string;
    generatedExercises: GeneratedExercise[];
    rawAiResponse?: string;
}

// --- Definiere das DEFAULT-WORKOUT ---
const DEFAULT_WORKOUT: WorkoutData = {
    id: '', // Platzhalter, wird später mit generateSimpleUniqueId() gefüllt
    workoutName: "Beginner Full Body (Default)",
    bodyPart: "Full Body",
    exercises: "4 exercises",
    location: "Home (No Equipment)",
    generatedExercises: [
        { title: "Jumping Jacks", duration: 5, difficulty: 1.5, typeString: "Cardio", description: "Light cardio to warm up and get the heart rate up." },
        { title: "Bodyweight Squats", duration: 8, difficulty: 2.0, typeString: "Strength", description: "Perform squats focusing on form. 3 sets of 10-12 reps." },
        { title: "Plank", duration: 4, difficulty: 2.5, typeString: "Core", description: "Hold a plank position, keeping your core tight. 3 sets, hold for 30-60 seconds." },
        { title: "Push-ups (Knee or Standard)", duration: 7, difficulty: 2.5, typeString: "Strength", description: "Perform push-ups. If standard is too hard, do them on your knees. 3 sets of 8-10 reps." }
    ],
    rawAiResponse: "This is a default workout for new users."
};


const MyWorkouts = () => {
    const navigate = useNavigate();
    const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [workoutsLoaded, setWorkoutsLoaded] = useState(false);


    // --- Lade Workouts beim ersten Rendern oder füge Default hinzu ---
    useEffect(() => {
        if (workoutsLoaded) return;

        const loadWorkouts = () => {
            try {
                const storedWorkoutsString = localStorage.getItem('savedWorkouts');
                if (storedWorkoutsString) {
                    const loaded: WorkoutData[] = JSON.parse(storedWorkoutsString);
                    const workoutsWithIds = loaded.map(w => ({ ...w, id: w.id || generateSimpleUniqueId() }));
                    setSavedWorkouts(workoutsWithIds);
                } else {
                    const defaultWorkoutWithNewId = { ...DEFAULT_WORKOUT, id: generateSimpleUniqueId() };
                    setSavedWorkouts([defaultWorkoutWithNewId]);
                    updateLocalStorage([defaultWorkoutWithNewId]);
                    console.log("No saved workouts found. Default workout added.");
                }
            } catch (e) {
                console.error("Failed to load or initialize workouts from localStorage:", e);
                setError("Failed to load your saved workouts.");
            } finally {
                setWorkoutsLoaded(true);
            }
        };

        loadWorkouts();
    }, [workoutsLoaded]);

    // --- Funktion zum Speichern von Workouts im localStorage ---
    const updateLocalStorage = (workouts: WorkoutData[]) => {
        try {
            localStorage.setItem('savedWorkouts', JSON.stringify(workouts));
        } catch (e) {
            console.error("Failed to save workouts to localStorage:", e);
            setError("Failed to save your workouts.");
        }
    };

    // --- Handler zum Löschen eines Workouts ---
    const handleDeleteWorkout = (idToDelete: string) => {
        if (window.confirm("Are you sure you want to delete this workout?")) {
            const updatedWorkouts = savedWorkouts.filter(workout => workout.id !== idToDelete);
            setSavedWorkouts(updatedWorkouts);
            updateLocalStorage(updatedWorkouts);

            const storedDailyWorkoutString = localStorage.getItem('dailyWorkout');
            if (storedDailyWorkoutString) {
                try {
                    const dailyWorkoutData = JSON.parse(storedDailyWorkoutString);
                    if (dailyWorkoutData && dailyWorkoutData.workout && dailyWorkoutData.workout.id === idToDelete) {
                        localStorage.removeItem('dailyWorkout');
                        alert('Your daily workout was deleted. A new one will be selected the next time "Today\'s Workout" is loaded.');
                    }
                } catch (e) {
                    console.error("Error parsing daily workout for deletion check:", e);
                }
            }
        }
    };

    // --- Handler zum Anzeigen der Übungsdetails ---
    const handleViewDetails = (workout: WorkoutData) => {
        navigate(`/workoutdetail/${encodeURIComponent(workout.workoutName)}`, {
            state: { exercises: workout.generatedExercises }
        });
    };

    // NEU: Handler für den "Create New Workout" Button
    const handleCreateNewWorkout = () => {
        // Navigiere zur Seite zum Erstellen/Generieren eines Workouts
        // Angenommen, das ist die TodaysWorkout.tsx Seite
        navigate('/todaysworkout');
    };


    // --- Render-Logik ---
    return (
        <div className="workout-wrapper">
            <div className="my-workout-page">
                <h1>My Workouts</h1>

          {!showForm && (
            <button className="createworkout-button" onClick={() => setShowForm(true)}>
              ➕ Create New Workout
            </button>
          )}

          {!showForm && savedWorkouts.length > 0 && (
            <ul className="todo-list">
              {savedWorkouts.map((workout, index) => (
                <li key={index} className="workout-item">
                  <div className="workout-info" onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}>
                    <strong>{workout.workoutName}</strong> — {workout.bodyPart}, {workout.exercises} exercises, at {workout.location}
                  </div>
                  <button onClick={() => handleStartClick(index)} className="start-button">▶️ Start</button>
                  <button onClick={() => handleDeleteClick(index)} className="delete-button">🗑️ Delete</button>
                </li>
              ))}
            </ul>
          )}

          {showForm && (
            <div >
              <div className="question-header">
                <img src={avatar} className="avatar-image" alt="avatar" />
                <div className="speech-bubble">{questions[steps[step]]}</div>
              </div>

              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                {steps[step] === 'bodyPart' && (
                  <div className="options">
                    {['Arms', 'Back', 'Abs', 'Legs', 'Glutes', 'Full Body'].map(part => (
                      <label key={part}>
                        <input
                          type="radio"
                          name="bodyPart"
                          checked={formData.bodyPart === part}
                          onChange={() => handleInputChange('bodyPart', part)}
                        />
                        {part}
                      </label>
                    ))}
                  </div>
                )}

                {steps[step] === 'exercises' && (
                  <div className="options">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <label key={num}>
                        <input
                          type="radio"
                          name="exercises"
                          checked={formData.exercises === String(num)}
                          onChange={() => handleInputChange('exercises', String(num))}
                        />
                        {num}
                      </label>
                    ))}
                  </div>
                )}

                {steps[step] === 'location' && (
                  <div className="options">
                    {['Home', 'Gym', 'Outdoor'].map(place => (
                      <label key={place}>
                        <input
                          type="radio"
                          name="location"
                          checked={formData.location === place}
                          onChange={() => handleInputChange('location', place)}
                        />
                        {place}
                      </label>
                    ))}
                  </div>
                )}

                {steps[step] === 'summary' && (
                  <div className="summary-container">
                    <label htmlFor="workoutName">Workout Name:</label>
                    <input
                      type="text"
                      id="workoutName"
                      value={formData.workoutName}
                      onChange={e => handleInputChange('workoutName', e.target.value)}
                      placeholder="Enter workout name"
                    />
                    <p>You're ready!</p>
                  </div>
                )}
              </motion.div>

              <div className="form-nav">
                <div>
                  {step === 0 ? (
                    <button className=".form-nav button" onClick={() => setShowForm(false)} disabled={isGenerating}>
                      Exit
                    </button>
                  ) : (
                    <button className=".form-nav button" onClick={handleBack} disabled={isGenerating}>
                      Back
                    </button>
                  )}
                </div>
                <div>
                  {step < steps.length - 1 ? (
                    <button className=".form-nav button" onClick={handleNext} disabled={isGenerating}>
                      Next
                    </button>
                  ) : (
                    <button className=".form-nav button" onClick={handleSubmit} disabled={isGenerating}>
                      {isGenerating ? 'Generating...' : (editingIndex !== null ? 'Save Changes' : 'Create Workout')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyWorkouts;