import React, { useState } from 'react';
import NutritionForm from './NutritionForm';
import './Nutrition.css';

const Nutrition = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [input, setInput] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState('');

  const handleSubmit = (data: any) => {
    setFormData(data);
    setShowForm(false);
  };

  const handleGenerate = () => {
    setGeneratedPlan(
      `Here's a personalized suggestion based on your preferences: "${input}". (A AI-generated plan will go here later.)`
    );
  };

  return (
    <div className="nutrition-page">
      <h1>Nutrition</h1>

      {/* Show MyNutrition button if form not open */}
      {!showForm && (
        <button className="myworkout-button" onClick={() => setShowForm(true)}>
          MyNutrition
        </button>
      )}

      {/* Show the form only when button is clicked */}
      {showForm && (
        <NutritionForm onSubmit={handleSubmit} />
      )}

      {/* Text input for cravings is always shown below the button */}
      {!showForm && (
        <div className="custom-request">
          <h3>Type what you're craving today and get a plan based on your taste</h3>
          <textarea
            className="input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Something warm, high in protein and veggie-rich"
          />
          <button className="save-button" onClick={handleGenerate}>
            Generate
          </button>

          {generatedPlan && (
            <div className="generated-plan">
              <p>{generatedPlan}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Nutrition;
