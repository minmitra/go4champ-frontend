import React, { useState } from 'react';
import WorkoutForm from './WorkoutForm';
import './Workout.css';

const Workout = () => {
  const [showForm, setShowForm] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<string[]>([]);

  const handleFormSubmit = (data: any) => {
    const generatedPlan = [
      'Monday: Full Body Strength (30min)',
      'Tuesday: Cardio Intervals (20min)',
      'Wednesday: Core & Stretching (25min)',
      'Friday: Lower Body Dumbbell Workout (40min)',
    ];
    setWorkoutPlan(generatedPlan);
    setShowForm(false);
  };

  return (
    <div className="workout-wrapper">
      <div className="workout-page">
        <h1>Workout</h1>

        {!showForm && (
          <button className="myworkout-button" onClick={() => setShowForm(true)}>
            MyWorkout
          </button>
        )}

        {showForm ? (
          <WorkoutForm onSubmit={handleFormSubmit} />
        ) : (
          <>
            <h2>Today's Plan</h2>
            {workoutPlan.length > 0 ? (
              <ul className="todo-list">
                {workoutPlan.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No plan yet. Click "MyWorkout" to create one!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Workout;
