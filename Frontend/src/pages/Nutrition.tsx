import React, { useState } from 'react';
import './Nutrition.css';

const Nutrition = () => {
  const [input, setInput] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState('');

  const handleGenerate = () => {
    setGeneratedPlan(
      `Here's a personalized suggestion based on your preferences: "${input}". (An AI-generated plan will go here later.)`
    );
  };

  return (
    <div className="nutrition-page">
      <h1>Nutrition</h1>

      <div className="custom-request">
        <p>Type what you're craving today and get a plan based on your taste</p>
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
    </div>
  );
};

export default Nutrition;