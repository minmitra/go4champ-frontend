import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './WorkoutDetail.css';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
}

interface WorkoutDetailProps {
  workoutName?: string;
  exercises: Exercise[];
}

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ workoutName, exercises }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const navigate = useNavigate();
  const { name } = useParams(); // fallback to param if needed

  const currentExercise = exercises[currentIndex];
  const totalExercises = exercises.length;

  const handleNext = () => {
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/my-workouts'); // done with workout
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
      <h1>{workoutName || name || 'Workout'}</h1>

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
          {currentIndex < totalExercises - 1 ? 'Next' : 'Finish'}
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

export default WorkoutDetail;
