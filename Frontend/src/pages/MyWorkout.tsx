import React, { useEffect, useState } from 'react';
import './Workout.css';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/fetchClient'; // Dein API-Client

// Die Struktur der Übungen, die von Anthropic zurückkommen soll
// MUSS genau zu dem passen, was dein Backend als 'Training' erwartet
// und was du hier im Frontend parsen möchtest.
interface GeneratedExercise {
    title: string;
    duration: number;
    difficulty: number; // float
    typeString: string; // Indoor oder Outdoor
    description: string;
}

// Erweitertes WorkoutData Interface, um die generierten Übungen zu speichern
type WorkoutData = {
    bodyPart: string;
    exercises: string; // Anzahl der Übungen (als String)
    location: string;
    workoutName: string; // Der vom User eingegebene Name für den Plan
    // Neu: Die tatsächlich generierten Übungen
    generatedExercises?: GeneratedExercise[];
    // Neu: Den ursprünglichen KI-Antwort-String (zum Debugging/Anzeigen)
    rawAiResponse?: string;
};

// Dummy-Übungen (können jetzt entfernt oder als Fallback behalten werden,
// da wir versuchen, echte KI-generierte Daten zu parsen)
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
        exercises: '', // Stored as string from radio button (e.g., "3")
        location: '',
        workoutName: '',
        generatedExercises: undefined, // Initialize as undefined
        rawAiResponse: undefined,
    });

    const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>(() => {
        const saved = localStorage.getItem('savedWorkouts');
        // Sicherstellen, dass parsed Daten dem WorkoutData-Typ entsprechen
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Optional: Validierung der geladenen Daten, falls Struktur sich ändert
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error("Failed to parse saved workouts from localStorage:", e);
                return [];
            }
        }
        return [];
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false); // Ladezustand für die AI-Generierung

    useEffect(() => {
        localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
    }, [savedWorkouts]);

    const steps = ['bodyPart', 'exercises', 'location', 'summary'];

    const questions: Record<string, string> = {
        bodyPart: 'Which body part do you want to train?',
        exercises: 'How many exercises do you want in the workout?',
        location: 'Where are you right now?',
        summary: 'Ready to generate your workout plan?',
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    const handleEditClick = (index: number) => {
        const workoutToEdit = savedWorkouts[index];
        setFormData(workoutToEdit);
        setStep(0);
        setShowForm(true);
        setEditingIndex(index);
    };

    // Anpassung für handleStartClick: Übergabe der tatsächlich generierten Übungen
    const handleStartClick = (index: number) => {
        const workout = savedWorkouts[index];
        if (!workout.workoutName) {
            alert('Workout name is missing.');
            return;
        }

        // Navigiere zum WorkoutDetail und übergebe die tatsächlich generierten Übungen
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

    // *** WICHTIGSTE ÄNDERUNG: handleSubmit zur Verarbeitung der KI-Antwort ***
    const handleSubmit = async () => {
        if (!formData.workoutName.trim()) {
            alert('Please enter a workout name before creating.');
            return;
        }

        if (editingIndex !== null) {
            // Dies ist der Pfad, wenn ein LOKALER Plan bearbeitet wird (nicht AI-Generierung)
            setSavedWorkouts(prev => {
                const copy = [...prev];
                copy[editingIndex] = formData;
                return copy;
            });
            setEditingIndex(null);
            setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
            setStep(0);
            setShowForm(false);
            alert('Workout erfolgreich aktualisiert (lokal).');
            return;
        }

        // --- Start der KI-Generierungs-Logik ---
        setIsGenerating(true);
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Sie müssen angemeldet sein, um einen Trainingsplan zu erstellen.');
            setIsGenerating(false);
            return;
        }

        try {
            // Prompt für die KI zusammenstellen (wird vom Backend-Controller ignoriert, aber wir senden ihn trotzdem)
            const prompt = `Create a ${formData.exercises} exercises ${formData.bodyPart} workout plan for ${formData.location}.`;
            console.log('Sende folgenden Prompt an die KI:', prompt);

            // API-Aufruf an den AI-Controller
            // Erwartete Antwort: { "antwort": "KI_JSON_STRING", "plan": "PLAN_NAME_VOM_BACKEND" }
            const response = await apiFetch<{ antwort: string; plan: string }>(`/ai/chat-create-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: prompt }), // Wir senden den Prompt, auch wenn er ignoriert wird
            });

            console.log('Antwort vom AI-Controller:', response);

            let parsedExercises: GeneratedExercise[] = [];
            if (response.antwort) {
                try {
                    // Der KI-Antwort-String könnte Text vor oder nach dem JSON enthalten.
                    // Versuchen wir, den JSON-Teil zu extrahieren.
                    const jsonMatch = response.antwort.match(/\[\s*\{.*?\}\s*(?:,\s*\{.*?\}\s*)*\]/s);
                    if (jsonMatch && jsonMatch[0]) {
                        parsedExercises = JSON.parse(jsonMatch[0]);
                        console.log('Parsed Exercises:', parsedExercises);
                    } else {
                        console.warn('KI-Antwort enthält kein parsbares JSON-Array:', response.antwort);
                        parsedExercises = defaultDummyExercises; // Fallback
                    }
                } catch (parseError) {
                    console.error('Fehler beim Parsen der KI-Antwort als JSON:', parseError);
                    parsedExercises = defaultDummyExercises; // Fallback
                }
            } else {
                console.warn('KI-Antwort enthielt kein "antwort"-Feld oder es war leer.');
                parsedExercises = defaultDummyExercises; // Fallback
            }

            // Erstelle das neue Workout-Objekt
            const newWorkout: WorkoutData = {
                ...formData, // Behalte die vom User eingegebenen Kriterien
                workoutName: formData.workoutName, // Oder response.plan, wenn du den vom Backend generierten Namen verwenden möchtest
                generatedExercises: parsedExercises, // Speichere die generierten Übungen
                rawAiResponse: response.antwort, // Speichere die rohe KI-Antwort (optional, für Debugging)
            };

            setSavedWorkouts(prev => [newWorkout, ...prev]);

            setFormData({
                bodyPart: '',
                exercises: '',
                location: '',
                workoutName: '',
                generatedExercises: undefined,
                rawAiResponse: undefined,
            });
            setStep(0);
            setShowForm(false);

            alert('Trainingsplan erfolgreich generiert und lokal gespeichert!');

            // --- HIER WURDE DIE NAVIGATION ENTFERNT ---
            // navigate(`/workoutdetail/${encodeURIComponent(newWorkout.workoutName)}`, {
            //     state: { exercises: newWorkout.generatedExercises }
            // });

        } catch (error) {
            console.error('Fehler beim Generieren des Trainingsplans (Frontend):', error);
            alert('Fehler beim Generieren des Trainingsplans. Bitte versuchen Sie es erneut.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="workout-wrapper">
            <div className="workout-page">
                <h1>My Workout</h1>

                {!showForm && (
                    <button className="myworkout-button" onClick={() => setShowForm(true)}>
                        ➕ Create New Workout
                    </button>
                )}

                {!showForm && savedWorkouts.length > 0 && (
                    <ul className="todo-list">
                        {savedWorkouts.map((workout, index) => (
                            <li key={index} className="workout-item">
                                <div
                                    className="workout-info"
                                    onClick={() => handleEditClick(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <strong>{workout.workoutName}</strong> — {workout.bodyPart}, {workout.exercises} exercises, at {workout.location}
                                    {/* Optional: Zeige eine Info, ob der Plan generierte Übungen hat */}
                                    {workout.generatedExercises && workout.generatedExercises.length > 0 && (
                                        <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#007bff' }}> (AI Generated)</span>
                                    )}
                                </div>
                                <button onClick={() => handleStartClick(index)} className="start-button">
                                    ▶️ Start
                                </button>
                                <button onClick={() => handleDeleteClick(index)} className="delete-button">
                                    🗑️ Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {showForm && (
                    <div className="workout-form">
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
                                <div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <label htmlFor="workoutName">Workout Name:</label>
                                        <input
                                            type="text"
                                            id="workoutName"
                                            value={formData.workoutName}
                                            onChange={e => handleInputChange('workoutName', e.target.value)}
                                            placeholder="Enter workout name"
                                            style={{
                                                padding: '8px',
                                                fontSize: '1rem',
                                                width: '100%',
                                                maxWidth: '300px',
                                                borderRadius: '6px',
                                                border: '1px solid #ccc',
                                                marginTop: '0.5rem',
                                            }}
                                        />
                                    </div>
                                    <p style={{ marginTop: '1rem' }}>You're ready!</p>
                                </div>
                            )}
                        </motion.div>

                        <div className="form-nav">
                            <div>
                                {step === 0 ? (
                                    <button className="save-button" onClick={() => setShowForm(false)} disabled={isGenerating}>
                                        Exit
                                    </button>
                                ) : (
                                    <button className="save-button" onClick={handleBack} disabled={isGenerating}>
                                        Back
                                    </button>
                                )}
                            </div>

                            <div>
                                {step < steps.length - 1 ? (
                                    <button className="save-button" onClick={handleNext} disabled={isGenerating}>
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        className="save-button"
                                        onClick={handleSubmit}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? 'Generating...' : (editingIndex !== null ? 'Save Changes' : 'Create Workout')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWorkout;