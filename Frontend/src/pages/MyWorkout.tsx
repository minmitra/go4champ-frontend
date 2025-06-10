import React, { useEffect, useState } from 'react';
import './Workout.css';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type WorkoutData = {
  bodyPart: string;
  exercises: string;
  location: string;
  workoutName: string;
};

const MyWorkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WorkoutData>({
    bodyPart: '',
    exercises: '',
    location: '',
    workoutName: '',
  });

  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>(() => {
    const saved = localStorage.getItem('savedWorkouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  const steps = ['bodyPart', 'exercises', 'location', 'summary'];

  const questions: Record<string, string> = {
    bodyPart: t('myWorkout.q_bodyPart'),
    exercises: t('myWorkout.q_exercises'),
    location: t('myWorkout.q_location'),
    summary: t('myWorkout.q_summary'),
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  const handleEditClick = (index: number) => {
    const workoutToEdit = savedWorkouts[index];
    setFormData(workoutToEdit);
    setStep(0);
    setShowForm(true);
    setEditingIndex(index);
  };

  const handleStartClick = (index: number) => {
    const workout = savedWorkouts[index];
    if (!workout.workoutName) {
      alert(t('myWorkout.alert_missingName'));
      return;
    }
    navigate(`/workoutdetail/${encodeURIComponent(workout.workoutName)}`);
  };

  const handleDeleteClick = (index: number) => {
    setSavedWorkouts(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setShowForm(false);
      setEditingIndex(null);
      setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
      setStep(0);
    }
  };

  const handleSubmit = () => {
    if (!formData.workoutName.trim()) {
      alert(t('myWorkout.alert_enterName'));
      return;
    }

    if (editingIndex !== null) {
      setSavedWorkouts(prev => {
        const copy = [...prev];
        copy[editingIndex] = formData;
        return copy;
      });
      setEditingIndex(null);
    } else {
      setSavedWorkouts(prev => [formData, ...prev]);
    }

    setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
    setStep(0);
    setShowForm(false);
  };

  return (
    <div className="workout-wrapper">
      <div className="workout-page">
        <h1>{t('myWorkout.title')}</h1>

        {!showForm && (
          <button className="myworkout-button" onClick={() => setShowForm(true)}>
            ➕ {t('myWorkout.createNew')}
          </button>
        )}

        {!showForm && savedWorkouts.length > 0 && (
          <ul className="todo-list">
            {savedWorkouts.map((workout, index) => (
              <li key={index} className="workout-item">
                <div
                  className="workout-info"
                  onClick={() => handleEditClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{workout.workoutName}</strong> — {workout.bodyPart}, {workout.exercises} {t('myWorkout.exercises')}, {t('myWorkout.at')} {workout.location}
                </div>
                <button onClick={() => handleStartClick(index)} className="start-button">
                  ▶️ {t('myWorkout.start')}
                </button>
                <button onClick={() => handleDeleteClick(index)} className="delete-button">
                  🗑️ {t('myWorkout.delete')}
                </button>
              </li>
            ))}
          </ul>
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
                 {['Arms', 'Back', 'Abs', 'Legs', 'Glutes', 'Full Body'].map(part => {
  const translationKey = part.toLowerCase().replace(/\s/g, '');
  return (
    <label key={part}>
      <input
        type="radio"
        name="bodyPart"
        checked={formData.bodyPart === part}
        onChange={() => handleInputChange('bodyPart', part)}
      />
      {t(`bodyParts.${translationKey}`)}
    </label>
  );
})}

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
                  <div style={{ marginTop: '1rem' }}>
                    <label htmlFor="workoutName">{t('myWorkout.name')}</label>
                    <input
                      type="text"
                      id="workoutName"
                      value={formData.workoutName}
                      onChange={e => handleInputChange('workoutName', e.target.value)}
                      placeholder={t('myWorkout.placeholder')}
                    />
                  </div>
                  <p style={{ marginTop: '1rem' }}>{t('myWorkout.ready')}</p>
                </div>
              )}
            </motion.div>

            <div className="form-nav">
              {step > 0 && (
                <button className="save-button" onClick={handleBack}>
                  {t('myWorkout.back')}
                </button>
              )}
              {step < steps.length - 1 ? (
                <button className="save-button" onClick={handleNext}>
                  {t('myWorkout.next')}
                </button>
              ) : (
                <button className="save-button" onClick={handleSubmit}>
                  {editingIndex !== null ? t('myWorkout.saveChanges') : t('myWorkout.create')}
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
