 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import './Workout.css';

const WorkoutForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    equipment: [] as string[],
    goal: '',
    area: '',
    hoursPerWeek: '',
    level: '',
  });

  const steps = ['equipment', 'goal', 'area', 'hours', 'level', 'summary'];

  const questionText: Record<string, string> = {
    equipment: 'What equipment do you have at home?',
    goal: 'What is your main workout goal?',
    area: 'Which area do you want to focus on?',
    hours: 'How many hours per week can you invest?',
    level: 'What is your fitness level?',
    summary: 'All set! Ready to generate your workout plan?',
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const list = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter(v => v !== value)
          : [...list, value],
      };
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));
  const handleSubmit = () => onSubmit(formData);

  return (
    <div className="workout-form">
      <div className="question-header">
        <img src={avatar} className="avatar-image" />
        <div className="speech-bubble">{questionText[steps[step]]}</div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.4 }}
      >
        {steps[step] === 'equipment' && (
          <div className="options">
            {['Dumbbells', 'Resistance bands', 'Yoga mat', 'Bench', 'None'].map(item => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(item)}
                  onChange={() => handleCheckboxChange('equipment', item)}
                />
                {item}
              </label>
            ))}
          </div>
        )}

        {steps[step] === 'goal' && (
          <div className="options">
            {['Muscle gain', 'Fat loss', 'Endurance', 'Pilates'].map(goal => (
              <label key={goal}>
                <input
                  type="radio"
                  name="goal"
                  checked={formData.goal === goal}
                  onChange={() => handleInputChange('goal', goal)}
                />
                {goal}
              </label>
            ))}
          </div>
        )}

        {steps[step] === 'area' && (
          <div className="options">
            {['Full body', 'Upper body', 'Core', 'Legs'].map(area => (
              <label key={area}>
                <input
                  type="radio"
                  name="area"
                  checked={formData.area === area}
                  onChange={() => handleInputChange('area', area)}
                />
                {area}
              </label>
            ))}
          </div>
        )}

        {steps[step] === 'hours' && (
          <div>
            <input
              type="number"
              placeholder="e.g. 4"
              className="nutrition-input"
              value={formData.hoursPerWeek}
              onChange={e => handleInputChange('hoursPerWeek', e.target.value)}
            />
          </div>
        )}

        {steps[step] === 'level' && (
          <div className="options">
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <label key={level}>
                <input
                  type="radio"
                  name="level"
                  checked={formData.level === level}
                  onChange={() => handleInputChange('level', level)}
                />
                {level}
              </label>
            ))}
          </div>
        )}

        {steps[step] === 'summary' && (
          <>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <p>Ready to generate your plan?</p>
          </>
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
      Generate Plan
    </button>
  )}
</div>
    </div>
  );
};

export default WorkoutForm;
