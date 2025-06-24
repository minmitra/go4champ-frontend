// src/components/Workoutdetail.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './WorkoutDetail.css';

// Die Struktur der Übungen MUSS der GeneratedExercise im MyWorkout.tsx entsprechen
interface Exercise {
  title: string;
  duration: number;
  difficulty: number;
  typeString: string;
  description: string;
}

const Workoutdetail = () => {
  const navigate = useNavigate();
  const { workoutName } = useParams();
  const location = useLocation();

  const exercises: Exercise[] = (location.state as { exercises?: Exercise[] })?.exercises || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // State für den Pausenmodus
  const [pauseTimeLeft, setPauseTimeLeft] = useState(30); // Countdown für die Pause
  // KORRIGIERTE ZEILE: Typ von NodeJS.Timeout zu number geändert
  const timerRef = useRef<number | null>(null); // Ref für den Timer

  // Stelle sicher, dass currentExercise nur versucht, auf ein Element zuzugreifen, wenn exercises nicht leer ist
  const currentExercise = exercises.length > 0 ? exercises[currentIndex] : null;

  // useEffect für den Pausen-Countdown
  useEffect(() => {
    // Wenn isPaused true ist und noch Zeit übrig ist, starte/setze den Timer fort
    if (isPaused && pauseTimeLeft > 0) {
      // Clear vorherigen Timer, falls vorhanden, um doppelte Timer zu vermeiden
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => { // window.setInterval für Klarheit im Browser
        setPauseTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPaused && pauseTimeLeft === 0) {
      // Pause beendet
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsPaused(false); // Pausenmodus verlassen
      setPauseTimeLeft(30); // Countdown zurücksetzen für die nächste Pause

      // Wenn dies die letzte Übung war und die Pause beendet ist, navigiere weg.
      // Andernfalls, die Anzeige wechselt automatisch auf die nächste Übung, da currentIndex
      // bereits in handleNext erhöht wurde.
      if (currentIndex === exercises.length) { // Überprüfe ob alle Übungen (und die letzte Pause) durch sind
        navigate('/myworkout'); // Workout beendet
      }
    }

    // Cleanup-Funktion für den Timer
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null; // Setze ref auf null nach dem Cleanup
      }
    };
  }, [isPaused, pauseTimeLeft, currentIndex, exercises.length, navigate]);


  const handleNext = () => {
    if (exercises.length === 0) {
        navigate('/myworkout');
        return;
    }

    // Wenn der Nutzer auf "Next Exercise" klickt, während eine Pause läuft,
    // sollte dies die Pause NICHT überspringen.
    // Die Pause muss von selbst ablaufen oder explizit übersprungen werden (hier nicht implementiert).
    if (isPaused && pauseTimeLeft > 0) {
      return; // Ignoriere Klicks während der aktiven Pause
    }

    // Überprüfe, ob es noch Übungen gibt
    if (currentIndex < exercises.length) { // <= exercises.length - 1 war korrekt für den Übungsindex.
                                           // Jetzt, nach einer Übung, ist der Index bereits um 1 erhöht,
                                           // aber die Übung selbst ist noch nicht angezeigt.
      // Wenn es weitere Übungen gibt (nach der aktuellen oder der letzten, die gerade beendet wurde),
      // setze die Komponente in den Pausenmodus.
      setIsPaused(true);
      setPauseTimeLeft(30); // Setze den Countdown zurück

      // Erhöhe den Index zur nächsten Übung. Diese Übung wird NACH der Pause angezeigt.
      // Wenn es die letzte Übung war, wird currentIndex jetzt exercises.length sein.
      // Die Logik im useEffect wird dann den Übergang zu /my-workouts nach der Pause triggern.
      setCurrentIndex(prevIndex => prevIndex + 1);

    } else {
        // Dies sollte normalerweise nur erreicht werden, wenn der letzte "Finish Workout"-Klick
        // ausgelöst wird und es keine weiteren Übungen gibt ODER wenn der letzte Timer abläuft.
        // Die Logik im useEffect übernimmt den Übergang nach der letzten Übungspause.
        navigate('/myworkout');
    }
  };


  const handleExit = () => {
    setShowExitConfirm(true);
    // Timer stoppen, wenn Exit-Bestätigung angezeigt wird
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Ref auch hier leeren
    }
  };

  const confirmExit = (confirm: boolean) => {
    setShowExitConfirm(false);
    if (confirm) {
      navigate('/myworkout');
    } else {
      // Timer fortsetzen, wenn Exit abgebrochen wird und eine Pause lief
      // Stelle sicher, dass der Timer nur fortgesetzt wird, wenn er zuvor aktiv war
      // und nicht beendet wurde (z.B. durch pauseTimeLeft === 0)
      if (isPaused && pauseTimeLeft > 0) {
        timerRef.current = window.setInterval(() => { // window.setInterval für Klarheit
          setPauseTimeLeft(prev => prev - 1);
        }, 1000);
      }
    }
  };

  // Wenn keine Übungen übergeben wurden, zeige einen Lade-/Fehlerzustand an.
  if (exercises.length === 0) { // currentExercise kann null sein, wenn exercises leer ist
    return (
      <div className="workout-detail-container">
        <h1>{workoutName || 'Your Workout'}</h1>
        <div className="info-card">
        <p>No exercises found for this workout. This might be a temporary issue or the AI did not return a valid plan.</p>
        <button className="primary-button" onClick={() => navigate('/myworkout')}>Back to My Workouts</button>
        </div>
      </div>
    );
  }

  // Wichtig: currentExercise sollte nur gesetzt sein, wenn wir NICHT in der letzten Pause sind
  // (d.h. currentIndex ist noch innerhalb des gültigen Bereichs der Übungen)
  const displayExercise = (isPaused && currentIndex < exercises.length) ? exercises[currentIndex] : currentExercise;


  return (
    <div className="workout-detail-container">
      <h1>{workoutName || 'Your Workout'}</h1>

      {isPaused && pauseTimeLeft > 0 ? (
        // Pausen-Ansicht
        <div className="pause-card">
          <h2>Break Time!</h2>
          <p>Next exercise in:</p>
          <div className="countdown">{pauseTimeLeft}s</div>
          {/* Zeige die nächste Übung nur an, wenn es noch Übungen gibt */}
          {displayExercise && (
             <p>Up next: <strong>{displayExercise.title}</strong></p>
          )}

          {/* Optional: Button zum Überspringen der Pause, falls gewünscht */}
          {/* <button className="next-button" onClick={() => setPauseTimeLeft(0)}>Skip Break</button> */}
        </div>
      ) : (
        // Übungs-Ansicht (nur anzeigen, wenn noch Übungen vorhanden sind und keine Pause)
        // und currentExercise nicht null ist (was bei exercises.length > 0 der Fall sein sollte für currentIndex < exercises.length)
        currentExercise && currentIndex < exercises.length ? (
          <div className="exercise-card">
            <h2>{currentExercise.title}</h2>
            <ul>
              <li><strong>Duration:</strong> {currentExercise.duration} minutes</li>
              <li><strong>Difficulty:</strong> {currentExercise.difficulty} / 5.0</li>
              <li><strong>Type:</strong> {currentExercise.typeString}</li>
              <li><strong>Description:</strong> {currentExercise.description}</li>
            </ul>
          </div>
        ) : (
          // Dieser Fall sollte selten eintreten, da die Navigation im useEffect greifen sollte.
          // Kann aber als Fallback dienen, falls die Logik etwas übersehen hat.
          <p>Workout completed or no exercises to show.</p>
        )
      )}

      <div className="navigation-buttons">
        <button className="exit-button" onClick={handleExit}>Exit</button>
        {isPaused && pauseTimeLeft > 0 ? (
          // "Next" Button deaktiviert oder anders beschriftet während der Pause
          <button className="next-button" disabled>
            Waiting for break to finish...
          </button>
        ) : (
          // "Next" Button, wenn keine Pause aktiv ist
          <button className="next-button" onClick={handleNext}>
            {currentIndex < exercises.length ? 'Next Exercise' : 'Finish Workout'}
            {/* Hier muss 'currentIndex < exercises.length' geprüft werden,
                da currentIndex nach dem letzten Klick auf exercises.length stehen könnte. */}
          </button>
        )}
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