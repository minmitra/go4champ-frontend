// NutritionForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import './Nutrition.css';

const NutritionForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    preferences: [] as string[],
    allergies: [] as string[],
    goal: '',
    age: '',
    weight: '',
    goalWeight: '',
    mealsPerDay: '',
  });

  const steps = [
    'preferences',
    'allergies',
    'goal',
    'ageWeight',
    'meals',
    'summary',
  ];

  const questionText: Record<string, string> = {
    preferences: 'What do you like to eat?',
    allergies: 'Any allergies or dietary preferences?',
    goal: 'What is your goal?',
    ageWeight: 'Tell us about yourself',
    meals: 'How many meals per day?',
    summary: 'Review your answers',
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

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const showWeightGoals =
    formData.goal === 'Fat loss' || formData.goal === 'Muscle building';

  return (
    <>
      <div className="question-header">
        <img src={avatar} alt="Avatar" className="avatar-image" />
        <div className="speech-bubble">{questionText[steps[step]]}</div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.4 }}
      >
        {steps[step] === 'preferences' && (
          <div className="nutrition-options">
            {['Fish', 'Meat', 'Vegetables', 'Fruits'].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={formData.preferences.includes(item)}
                  onChange={() => handleCheckboxChange('preferences', item)}
                />
                {item}
              </label>
            ))}
          </div>
        )}

        {steps[step] === 'allergies' && (
          <div className="nutrition-options">
            {['Lactose intolerant', 'Vegan', 'Vegetarian', 'No fish'].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(item)}
                  onChange={() => handleCheckboxChange('allergies', item)}
                />
                {item}
              </label>
            ))}
          </div>
        )}

        {steps[step] === 'goal' && (
          <div className="nutrition-options">
            {['Muscle building', 'Fat loss', 'Endurance'].map((goal) => (
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

        {steps[step] === 'ageWeight' && (
          <>
            <h3>How old are you?</h3>
            <input
              type="number"
              className="nutrition-input"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />

            <h3>Your weight (kg)</h3>
            <input
              type="number"
              className="nutrition-input"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
            />

            {showWeightGoals && (
              <>
                <h3>Your goal weight (kg)</h3>
                <input
                  type="number"
                  className="nutrition-input"
                  value={formData.goalWeight}
                  onChange={(e) => handleInputChange('goalWeight', e.target.value)}
                />
              </>
            )}
          </>
        )}

        {steps[step] === 'meals' && (
          <select
            className="nutrition-select"
            value={formData.mealsPerDay}
            onChange={(e) => handleInputChange('mealsPerDay', e.target.value)}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}

        {steps[step] === 'summary' && (
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        )}
      </motion.div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
        {step > 0 && (
          <button className="save-button" onClick={handleBack}>Back</button>
        )}
        {step < steps.length - 1 ? (
          <button className="save-button" onClick={handleNext}>Next</button>
        ) : (
          <button className="save-button" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </>
  );
};

export default NutritionForm;
