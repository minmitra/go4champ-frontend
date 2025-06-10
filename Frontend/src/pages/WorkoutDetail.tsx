// src/components/Workoutdetail.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './WorkoutDetail.css';
import { useTranslation } from 'react-i18next';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
}

const Workoutdetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workoutName } = useParams();

  const exercises: Exercise[] = [
    { name: 'Squats', sets: 4, reps: 12, instructions: t('workoutDetail.instructions.squats') },
    { name: 'Lunges', sets: 3, reps: 10, instructions: t('workoutDetail.instructions.lunges') },
    { name: 'Leg Press', sets: 3, reps: 15 },
    { name: 'Calf Raises', sets: 4, reps: 20, instructions: t('workoutDetail.instructions.calfRaises') }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentExercise = exercises[currentIndex];

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/myworkout');
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = (confirm: boolean) => {
    setShowExitConfirm(false);
    if (confirm) {
      navigate('/myworkout');
    }
  };

  return (
    <div className="workout-detail-container">
      <div className="workout-title">{workoutName || t('workoutDetail.defaultTitle')}</div>

      <div className="exercise-card">
        <h2>{currentExercise.name}</h2>
        <ul>
          <li><strong>{t('workoutDetail.sets')}:</strong> {currentExercise.sets}</li>
          <li><strong>{t('workoutDetail.reps')}:</strong> {currentExercise.reps}</li>
          {currentExercise.instructions && (
            <li><strong>{t('workoutDetail.instructionsLabel')}:</strong> {currentExercise.instructions}</li>
          )}
        </ul>
      </div>

      <div className="navigation-buttons">
        <button className="exit-button" onClick={handleExit}>{t('workoutDetail.exit')}</button>
        <button className="next-button" onClick={handleNext}>
          {currentIndex < exercises.length - 1 ? t('workoutDetail.next') : t('workoutDetail.finish')}
        </button>
      </div>

      {showExitConfirm && (
        <div className="exit-confirm-modal">
          <div className="modal-content">
            <p>{t('workoutDetail.confirmExit')}</p>
            <div className="modal-content-buttons">
              <button onClick={() => confirmExit(true)}>{t('yes')}</button>
              <button onClick={() => confirmExit(false)}>{t('no')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workoutdetail;
