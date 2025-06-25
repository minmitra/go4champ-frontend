import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyWorkout.css'; // Dein CSS-File

// --- Hilfsfunktion zum Generieren einer einfachen, eindeutigen ID ---
const generateSimpleUniqueId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// --- Interface-Definitionen ---
interface GeneratedExercise {
    title: string;
    duration: number; // Dauer in Minuten
    difficulty: number;
    typeString: string;
    description: string;
}

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

                {error && <p className="error-message">{error}</p>}

                {/* NEU: Button zum Erstellen eines neuen Workouts */}
                <button
                    className="create-new-workout-btn"
                    onClick={handleCreateNewWorkout}
                >
                    Create New Workout
                </button>
                <hr className="section-divider" /> {/* Trennlinie für bessere Übersicht */}


                {/* Anzeige der gespeicherten Workouts */}
                {savedWorkouts.length === 0 && workoutsLoaded ? (
                    <p className="no-workouts-message">
                        You have no saved workouts yet.
                        <br />Generate a new one using the button above!
                        {localStorage.getItem('savedWorkouts') === null && <br/> }
                    </p>
                ) : (
                    <div className="workout-list">
                        {savedWorkouts.map((workout) => (
                            <div key={workout.id} className="workout-card">
                                <h3>{workout.workoutName}</h3>
                                <p><strong>Body Part:</strong> {workout.bodyPart}</p>
                                <p><strong>Exercises:</strong> {workout.exercises}</p>
                                <p><strong>Location:</strong> {workout.location}</p>
                                <div className="card-actions">
                                    <button
                                        className="view-details-btn"
                                        onClick={() => handleViewDetails(workout)}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteWorkout(workout.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWorkouts;