// src/components/TodaysWorkout.tsx

import React from 'react';
import './Workout.css';

const TodaysWorkout = () => {
  const handleStart = () => {
    alert("Let's start today's workout!");
    // Optional: hier kannst du Navigation oder Animation hinzufügen
  };

  return (
    <div className="workout-wrapper">
      <div className="workout-page">
        <h1>Today's Workout</h1>
        <div className="workout-form">
          <p>Get ready for your daily session. Stay consistent!</p>
          <button className="workout-button" onClick={handleStart}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysWorkout;
