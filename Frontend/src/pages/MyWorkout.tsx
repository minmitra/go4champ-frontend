import React from 'react';
import './MyWorkout.css';

const MyWorkout: React.FC = () => {
  const handleStartWorkout = () => {
    console.log('Workout started');
  };

  const handleCreateWorkout = () => {
    console.log('Workout started');
  };

  return (
    <div className="myworkout-page">
      <h1>My Workout</h1>

      <div className="myworkout-wrapper">
        {/* Today's Workout Section */}
        <div className="todaysworkout-section">
          <h2 className="section-title">Today's Workout</h2>
          <button className="todaysworkout-button" onClick={handleStartWorkout}>
            Start
          </button>
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Create Workout Section */}
        <div className="createworkout-section">
          <h2 className="section-title">Create Workout</h2>
          <button className="createworkout-button" onClick={handleCreateWorkout}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyWorkout;
