import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workout.css'; // Stil für die Workout-Komponenten

// Definiere die Struktur der gespeicherten Workouts
// MUSS genau zu dem passen, was in MyWorkout.tsx gespeichert wird
interface GeneratedExercise {
    title: string;
    duration: number;
    difficulty: number;
    typeString: string;
    description: string;
}

type WorkoutData = {
    bodyPart: string;
    exercises: string; // Anzahl der Übungen (als String)
    location: string;
    workoutName: string; // Der vom User eingegebene Name für den Plan
    generatedExercises?: GeneratedExercise[]; // Die tatsächlich generierten Übungen
    rawAiResponse?: string; // Die rohe KI-Antwort (optional)
};

// Interface für das im localStorage gespeicherte "Today's Workout" mit Datum
interface DailyWorkoutStorage {
    date: string; // Datum im Format YYYY-MM-DD
    workout: WorkoutData;
}

// Fallback-Übungen, falls keine generierten Übungen gefunden werden
const defaultFallbackExercises: GeneratedExercise[] = [
    { title: 'Warm-up Jog', duration: 10, difficulty: 1.0, typeString: 'Outdoor', description: 'Light jog to warm up.' },
    { title: 'Stretch Routine', duration: 15, difficulty: 1.5, typeString: 'Indoor', description: 'Full body stretching.' },
    { title: 'Basic Core', duration: 20, difficulty: 2.0, typeString: 'Indoor', description: 'Crunches, planks, leg raises.' }
];


const TodaysWorkout = () => {
    const navigate = useNavigate();
    const [todaysWorkout, setTodaysWorkout] = useState<WorkoutData | null>(null);

    useEffect(() => {
        const today = new Date();
        const todayString = today.toISOString().slice(0, 10); // Format YYYY-MM-DD

        const storedDailyWorkoutString = localStorage.getItem('dailyWorkout');
        let dailyWorkout: DailyWorkoutStorage | null = null;

        if (storedDailyWorkoutString) {
            try {
                dailyWorkout = JSON.parse(storedDailyWorkoutString);
            } catch (e) {
                console.error("Failed to parse dailyWorkout from localStorage:", e);
                dailyWorkout = null;
            }
        }

        if (dailyWorkout && dailyWorkout.date === todayString) {
            // Wenn ein Workout für heute gespeichert ist, verwende es
            setTodaysWorkout(dailyWorkout.workout);
        } else {
            // Andernfalls, wähle ein neues Workout und speichere es für heute
            const savedWorkoutsString = localStorage.getItem('savedWorkouts');
            if (savedWorkoutsString) {
                try {
                    const loadedWorkouts: WorkoutData[] = JSON.parse(savedWorkoutsString);
                    if (loadedWorkouts.length > 0) {
                        const randomIndex = Math.floor(Math.random() * loadedWorkouts.length);
                        const selectedWorkout = loadedWorkouts[randomIndex];

                        const newDailyWorkout: DailyWorkoutStorage = {
                            date: todayString,
                            workout: selectedWorkout
                        };
                        localStorage.setItem('dailyWorkout', JSON.stringify(newDailyWorkout));
                        setTodaysWorkout(selectedWorkout);
                    } else {
                        setTodaysWorkout(null); // Keine Workouts gespeichert
                    }
                } catch (e) {
                    console.error("Failed to parse saved workouts from localStorage in TodaysWorkout (new selection):", e);
                    setTodaysWorkout(null);
                }
            } else {
                setTodaysWorkout(null); // Keine Workouts im localStorage
            }
        }
    }, []); // Leeres Array, damit der Effekt nur einmal beim Mounten ausgeführt wird


    const handleStart = () => {
        if (todaysWorkout) {
            // Navigiere zum WorkoutDetail und übergebe die generierten Übungen
            navigate(`/workoutdetail/${encodeURIComponent(todaysWorkout.workoutName)}`, {
                state: { exercises: todaysWorkout.generatedExercises || defaultFallbackExercises }
            });
        } else {
            alert("No workout available for today. Please create one in 'My Workouts' first!");
            navigate('/myworkout'); // Optional: direkt zu My Workouts navigieren
        }
    };

    return (
        <div className="workout-wrapper">
            <div className="workout-page">
                <h1>Today's Workout</h1>
                <div className="workout-form">
                    {todaysWorkout ? (
                        <>
                            <h2>{todaysWorkout.workoutName}</h2>
                            <p>Body Part: {todaysWorkout.bodyPart}</p>
                            <p>Exercises: {todaysWorkout.exercises}</p>
                            <p>Location: {todaysWorkout.location}</p>
                            <p>Get ready for your daily session. Stay consistent!</p>
                            <button className="workout-button" onClick={handleStart}>
                                Start Workout
                            </button>
                        </>
                    ) : (
                        <>
                            <p>No workout available for today.</p>
                            <p>Please create some workouts in "My Workouts" to get a daily suggestion.</p>
                            <button className="workout-button" onClick={() => navigate('/myworkout')}>
                                Go to My Workouts
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodaysWorkout;