// src/components/TodaysWorkout.tsx
import React from 'react';
import './Workout.css';
import { useTranslation } from 'react-i18next';

const TodaysWorkout = () => {
  const { t } = useTranslation();

  const handleStart = () => {
    alert(t('todaysWorkoutStart')); // Dynamisch übersetzte Alert-Nachricht
  };

  return (
    <div className="workout-wrapper">
      <div className="workout-page">
        <h1>{t('todaysWorkout')}</h1> {/* Übersetzter Titel */}
        <div className="workout-form">
          <p>{t('todaysWorkoutMotivation')}</p> {/* Motivations-Text */}
          <button className="workout-button" onClick={handleStart}>
            {t('myWorkout.start')} {/* Start-Button aus dem myWorkout-Block */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysWorkout;
