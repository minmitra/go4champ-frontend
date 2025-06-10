import React, { useEffect, useState } from 'react';
import './Workout.css';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import { useNavigate } from 'react-router-dom';

type WorkoutData = {
  bodyPart: string;
  exercises: string;
  location: string;
  workoutName: string;
};

const MyWorkout = () => {
  // -------------- Neu: useNavigate Hook initialisieren --------------
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WorkoutData>({
    bodyPart: '',
    exercises: '',
    location: '',
    workoutName: '',
  });
  
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>(() => {
    const saved = localStorage.getItem('savedWorkouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
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

  // -------------- Neu: Navigation beim Start-Button --------------
const handleStartClick = (index: number) => {
  const workout = savedWorkouts[index];
  if (!workout.workoutName) {
    alert('Workout name is missing.');
    return;
  }
  navigate(`/workoutdetail/${encodeURIComponent(workout.workoutName)}`);
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

  const handleSubmit = () => {
    if (!formData.workoutName.trim()) {
      alert('Please enter a workout name before creating.');
      return;
    }

    if (editingIndex !== null) {
      setSavedWorkouts(prev => {
        const copy = [...prev];
        copy[editingIndex] = formData;
        return copy;
      });
      setEditingIndex(null);
    } else {
      setSavedWorkouts(prev => [formData, ...prev]);
    }

    setFormData({
      bodyPart: '',
      exercises: '',
      location: '',
      workoutName: '',
    });
    setStep(0);
    setShowForm(false);
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
                </div>
                {/* -------------- Neu: Start-Button ruft handleStartClick auf -------------- */}
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
                  {['Arms', 'Back', 'Abs', 'Legs', 'Glutes'].map(part => (
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
              {step > 0 && (
                <button className="save-button" onClick={handleBack}>
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button className="save-button" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button className="save-button" onClick={handleSubmit}>
                  {editingIndex !== null ? 'Save Changes' : 'Create Workout'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkout;