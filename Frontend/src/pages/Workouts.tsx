import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workout.css';


interface GeneratedExercise {
  title: string;
  duration: number;
  difficulty: number;
  typeString: string;
  description: string;
}

type WorkoutData = {
  bodyPart: string;
  exercises: string;
  location: string;
  workoutName: string;
  generatedExercises?: GeneratedExercise[];
  rawAiResponse?: string;
};

interface DailyWorkoutStorage {
  date: string;
  workout: WorkoutData;
}

const defaultFallbackExercises: GeneratedExercise[] = [
  { title: 'Warm-up Jog', duration: 10, difficulty: 1.0, typeString: 'Outdoor', description: 'Light jog to warm up.' },
  { title: 'Stretch Routine', duration: 15, difficulty: 1.5, typeString: 'Indoor', description: 'Full body stretching.' },
  { title: 'Basic Core', duration: 20, difficulty: 2.0, typeString: 'Indoor', description: 'Crunches, planks, leg raises.' }
];

const Workouts = () => {
  const navigate = useNavigate();
  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutData | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>(() => {
    const saved = localStorage.getItem('savedWorkouts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const todayString = new Date().toISOString().slice(0, 10);
    const storedDailyWorkout = localStorage.getItem('dailyWorkout');

    if (storedDailyWorkout) {
      const dailyWorkout: DailyWorkoutStorage = JSON.parse(storedDailyWorkout);
      if (dailyWorkout.date === todayString) {
        setTodaysWorkout(dailyWorkout.workout);
        return;
      }
    }

    if (savedWorkouts.length > 0) {
      const randomWorkout = savedWorkouts[Math.floor(Math.random() * savedWorkouts.length)];
      const newDaily: DailyWorkoutStorage = { date: todayString, workout: randomWorkout };
      localStorage.setItem('dailyWorkout', JSON.stringify(newDaily));
      setTodaysWorkout(randomWorkout);
    }
  }, [savedWorkouts]);

  useEffect(() => {
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  const handleStartClick = (workout: WorkoutData) => {
    navigate(`/workoutdetail/${encodeURIComponent(workout.workoutName)}`, {
      state: { exercises: workout.generatedExercises || defaultFallbackExercises }
    });
  };

  const handleDeleteClick = (index: number) => {
    setSavedWorkouts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main>
      
         {/* Today's Workout Section */}
      <section>
        <h2>Today's Workout</h2>
        <p>Here’s your personalized workout for today – let’s crush it!</p>
        <div className="todaysworkout-card">
          {todaysWorkout ? (
            <>
              <h3 className='todaysworkout-h3'>{todaysWorkout.workoutName}</h3>
              <p><strong>Details:</strong></p>
              <p>Body Part: {todaysWorkout.bodyPart}</p>
              <p>Exercises: {todaysWorkout.exercises}</p>
              <p>Location: {todaysWorkout.location}</p>
              <button className="primary-button" onClick={() => handleStartClick(todaysWorkout)}>Start</button>
            </>
          ) : (
            <>
              <p>No workout available for today.To continue, first create a new workout.</p>
            </>
          )}
        </div>
      </section>
      {/* My Workouts Section */}
      <section>
        <h2>Create your workout</h2>

        <p>Use AI to instantly generate workouts tailored to your goals and location.</p>
        <button className="primary-button" onClick={() => navigate('/CreateWorkout')}>
          Create New Workout
        </button>
         <p>Manage or start your saved workouts:</p>
        {savedWorkouts.length > 0 ? (
          <ul className="todo-list">
            {savedWorkouts.map((workout, index) => (
              <li key={index} className="workout-item">
                <div onClick={() => handleStartClick(workout)} style={{ cursor: 'pointer' }}>
                  <strong>{workout.workoutName}</strong> — {workout.bodyPart}, {workout.exercises}, {workout.location}
                </div >
                <div className="todo-actions">
                <button className="start-button" onClick={() => handleStartClick(workout)}>Start</button>
                <button className="delete-button" onClick={() => handleDeleteClick(index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts saved yet.</p>
        )}
      </section>
    </main>
  );
};

export default Workouts;


