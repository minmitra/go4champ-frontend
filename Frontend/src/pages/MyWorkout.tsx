// src/components/MyWorkout.tsx

import React, { useState } from 'react';
import './Workout.css';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';

const MyWorkout = () => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    bodyPart: '',
    exercises: '',
    location: '',
  });

  const steps = ['bodyPart', 'exercises', 'location', 'summary'];

  const questions: Record<string, string> = {
    bodyPart: 'Which body part do you want to train?',
    exercises: 'How many exercises do you want in the workout?',
    location: 'Where are you right now?',
    summary: 'Ready to generate your workout plan?',
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));
  const handleSubmit = () => {
    alert('Workout created:\n' + JSON.stringify(formData, null, 2));
    setShowForm(false);
    setStep(0);
  };

  return (
    <div className="workout-wrapper">
      <div className="workout-page">
        <h1>My Workout</h1>

        {!showForm && (
          <button className="myworkout-button" onClick={() => setShowForm(true)}>
            ➕ Create New Workout
          </button>
        )}

        {showForm && (
          <div className="workout-form">
            <div className="question-header">
              <img src={avatar} className="avatar-image" alt="avatar" />
              <div className="speech-bubble">{questions[steps[step]]}</div>
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              {steps[step] === 'bodyPart' && (
                <div className="options">
                  {['Arms', 'Back', 'Abs', 'Legs', 'Glutes'].map(part => (
                    <label key={part}>
                      <input
                        type="radio"
                        name="bodyPart"
                        checked={formData.bodyPart === part}
                        onChange={() => handleInputChange('bodyPart', part)}
                      />
                      {part}
                    </label>
                  ))}
                </div>
              )}

              {steps[step] === 'exercises' && (
                <div className="options">
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <label key={num}>
                      <input
                        type="radio"
                        name="exercises"
                        checked={formData.exercises === String(num)}
                        onChange={() => handleInputChange('exercises', String(num))}
                      />
                      {num}
                    </label>
                  ))}
                </div>
              )}

              {steps[step] === 'location' && (
                <div className="options">
                  {['Home', 'Gym', 'Outdoor'].map(place => (
                    <label key={place}>
                      <input
                        type="radio"
                        name="location"
                        checked={formData.location === place}
                        onChange={() => handleInputChange('location', place)}
                      />
                      {place}
                    </label>
                  ))}
                </div>
              )}

              {steps[step] === 'summary' && (
                <div>
                  <pre>{JSON.stringify(formData, null, 2)}</pre>
                  <p>You're ready!</p>
                </div>
              )}
            </motion.div>

            <div className="form-nav">
              {step > 0 && (
                <button className="save-button" onClick={handleBack}>
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button className="save-button" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button className="save-button" onClick={handleSubmit}>
                  Create Workout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkout;
