// src/components/Workoutdetail.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './WorkoutDetail.css';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
}

const Workoutdetail = () => {
  const navigate = useNavigate();
  const { workoutName } = useParams(); // z. B. /workout/LEGS WORKOUT

  // Dummy-Übungen – später durch KI-generierte Daten ersetzen
  const exercises: Exercise[] = [
    { name: 'Squats', sets: 4, reps: 12, instructions: 'Keep your back straight and go deep.' },
    { name: 'Lunges', sets: 3, reps: 10, instructions: 'Alternate legs, slow and steady.' },
    { name: 'Leg Press', sets: 3, reps: 15 },
    { name: 'Calf Raises', sets: 4, reps: 20, instructions: 'Pause at the top for a second.' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentExercise = exercises[currentIndex];

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/my-workouts');
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = (confirm: boolean) => {
    setShowExitConfirm(false);
    if (confirm) {
      navigate('/my-workouts');
    }
  };

  return (
    <div className="workout-detail-container">
      <h1>{workoutName || 'Your Workout'}</h1>

      <div className="exercise-card">
        <h2>{currentExercise.name}</h2>
        <ul>
          <li><strong>Sets:</strong> {currentExercise.sets}</li>
          <li><strong>Reps:</strong> {currentExercise.reps}</li>
          {currentExercise.instructions && (
            <li><strong>Instructions:</strong> {currentExercise.instructions}</li>
          )}
        </ul>
      </div>

      <div className="navigation-buttons">
        <button className="exit-button" onClick={handleExit}>Exit</button>
        <button className="next-button" onClick={handleNext}>
          {currentIndex < exercises.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>

      {showExitConfirm && (
        <div className="exit-confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to quit your super duper workout?</p>
            <button onClick={() => confirmExit(true)}>Yes</button>
            <button onClick={() => confirmExit(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workoutdetail;