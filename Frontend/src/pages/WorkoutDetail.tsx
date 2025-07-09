import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './WorkoutDetail.css'; 


interface GeneratedExercise {
  title: string;
  duration: number; 
  difficulty: number;
  typeString: string;
  description: string;
}

const BREAK_TIME_SECONDS = 30;

const WorkoutDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutName } = useParams<{ workoutName: string }>();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const exercises: GeneratedExercise[] = location.state?.exercises || [];

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isExercisePhase, setIsExercisePhase] = useState(true); 
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false); 

  const [workoutStarted, setWorkoutStarted] = useState(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const moveToNextPhase = () => {
    if (isExercisePhase) {
      setIsExercisePhase(false);
      setIsRunning(true); 
    } else {
      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex < exercises.length) {
        setCurrentExerciseIndex(nextIndex);
        setIsExercisePhase(true); 
        setIsRunning(false); 
      } else {
        setIsRunning(false); 
        alert('Congratulations! You completed the workout!');
        navigate('/workouts'); 
      }
    }
  };

  useEffect(() => {
    if (timerIntervalRef.current) {
      clearTimeout(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (exercises.length === 0) {
      setTimerSeconds(0);
      setIsRunning(false);
      return;
    }
    let durationToSet: number;
    if (isExercisePhase) {
      const currentExercise = exercises[currentExerciseIndex];
      durationToSet = (currentExercise?.duration || 0) * 60;
    } else {
      durationToSet = BREAK_TIME_SECONDS;
    }

    setTimerSeconds(durationToSet);
    if (workoutStarted && isExercisePhase) {
      setIsRunning(false);
    }
  }, [currentExerciseIndex, isExercisePhase, exercises, workoutStarted]);


  useEffect(() => {
    if (isRunning && timerSeconds > 0) {
      timerIntervalRef.current = setTimeout(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timerSeconds === 0) {
      if (timerIntervalRef.current) {
        clearTimeout(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      moveToNextPhase();
    }

    return () => {
      if (timerIntervalRef.current) {
        clearTimeout(timerIntervalRef.current);
      }
    };
  }, [isRunning, timerSeconds, moveToNextPhase]); 

  const startWorkout = () => {
    setWorkoutStarted(true);
    setIsRunning(false); 
  };

  const toggleStartPause = () => {
    if (isExercisePhase) { 
      setIsRunning(prev => !prev);
    } 
  };

  const handleSkipExercise = () => {
    if(isExercisePhase) {
      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex < exercises.length) {
        setCurrentExerciseIndex(nextIndex);
        setIsExercisePhase(true);
        setIsRunning(false);
      }
      else {
        setIsRunning(false);
        alert('Congratulations! You just completed the workout!');
        navigate('/workouts');
      }
    }
  };

  const confirmExitWorkout = () => {
    if(timerIntervalRef.current) {
      clearTimeout(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    navigate('/workouts');
  };

  const promptExitWorkout = () => {
    if (!workoutStarted) {
      navigate('/workouts');
    } else {
      setIsRunning(false);
      setShowExitConfirmation(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div className="workout-detail-container">
        <h2>No exercises found for this workout.</h2>
        <button className="workout-button" onClick={() => navigate('/workouts')}>Go back</button>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <main>
    <div >
      
      <h1>{decodeURIComponent(workoutName || 'Workout Details')}</h1>

      {!workoutStarted ? (
        <div className="workout-initial-screen">
          <h2>Ready to start your workout?</h2>
          <p className="workout-summary-info">
            This workout consists of {exercises.length} exercises.
            Total estimated time: {exercises.reduce((sum, ex) => sum + ex.duration, 0)} minutes.
          </p>
          <div className="initial-buttons">
            <button className="primary2-button" onClick={startWorkout}>
              Start
            </button>
            <button className='workout-button back-button-inline' onClick={() => navigate('/workouts')} >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="workout-active-mode">
          <div className="workout-status">
            {isExercisePhase ? (
              <p className="exercise-counter">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </p>
            ) : (
              <p className="break-status">BREAK TIME!</p>
            )}
            <p className="timer-display large-timer">{formatTime(timerSeconds)}</p>
          </div>
          <div className="exercise-display">
            {currentExercise ? (
              <div className="current-exercise-card">
              {isExercisePhase ? (
                <>
                  <h3>{currentExercise.title}</h3>
                  <p className="exercise-description-full">
                    {currentExercise.description}
                  </p>
                  <p className='time-counter'><strong>Duration:</strong> {currentExercise.duration} minutes</p>
                  <p><strong>Difficulty:</strong> {currentExercise.difficulty}</p>
                  <p><strong>Type:</strong> {currentExercise.typeString}</p>
                </>
              ) : (
                <>
                  <h3>REST</h3>
                  <p className="break-message">Take a moment to breathe and prepare for the next exercise.</p>
                  <p>Next up: {exercises[currentExerciseIndex + 1]?.title || 'Workout Complete!'}</p>
                </>
              )}
              </div>
            ) : (
              <p>Loading workout step...</p>
            )}
          </div>
          <div className="workout-controls">
            <button className="primary-button" onClick={toggleStartPause} disabled={currentExerciseIndex === exercises.length - 1 && timerSeconds === 0 && !isRunning}>
              {isRunning ? 'Pause' : 'Start Exercise'} 
            </button>
            <button className="primary-button" onClick={handleSkipExercise}>
              Skip Exercise
            </button>               
          </div>
          <div className='exit-button-workout'>
            <button className='workout-button exit-button-inline' onClick={promptExitWorkout}>
              Exit Workout
            </button>
          </div>
        </div>
      )}
      {showExitConfirmation && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <p>Are you sure you want to exit the workout? All progress will be lost.</p>
            <div className='modal-buttons'>
              <button className='workout-button exit-button' onClick={confirmExitWorkout}>Yes</button>
              <button className='workout-button' onClick={() => {setShowExitConfirmation(false); setIsRunning(isExercisePhase);}}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </main>
  );
};

export default WorkoutDetail;