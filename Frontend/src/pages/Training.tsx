// src/pages/Training.tsx

import React, { useState } from 'react';
import './Training.css';

type Exercise = {
    id: number;
    name: string;
    image: string;
    description: string;
    effect: string;
};


export const exerciseData: Record<string, Exercise[]>= {
    arms: [
        {
        id: 1,
        name: "Biceps Curls",
        image: "",//muss gif,
        description: "Trains your biceps using dumbbells or resistance bands.",
        effect: "Builds strenght in the front part of your upper arm.",
        },
        {
        id: 2,
        name: "Triceps Dips",
        image: "",//muss gif,
        description: "Bodyweight exercise using a bench or chair.",
        effect: "Targets and tones the back of your arms.",
        },
    ],
    legs: [
        {
        id: 3,
        name: "Squats",
        image: "",//muss gif,
        description: "Lower body strength exercise using your own body weight.",
        effect: "Strengthens thighs, glutes, and core.",
        },
    ]
}

const Training: React.FC = () => {
  // Currently selected category (e.g., "arms", "legs")
  const [selectedCategory, setSelectedCategory] = useState<string>('arms');

  // Holds the selected exercise to show in modal
  const [selectedExercise, setSelectedExercise] = useState<Exercise| null>(null);

  // Dynamically grab all available categories from the data
  const categories = Object.keys(exerciseData);

  return (
    <main className="training">
      {/* Category navigation */}
      <nav className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === selectedCategory ? 'active' : ''}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Grid showing all exercises in the selected category */}
      <div className="exercise-grid">
        {exerciseData[selectedCategory]?.map((exercise: Exercise) => (
          <div
            key={exercise.id}
            className="exercise-card"
            onClick={() => setSelectedExercise(exercise)}
          >
            <img src={exercise.image} alt={exercise.name} />
            <h3>{exercise.name}</h3>
          </div>
        ))}
      </div>

      {/* Modal popup with more information about the selected exercise */}
      {selectedExercise && (
        <div className="modal" onClick={() => setSelectedExercise(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedExercise.name}</h2>
            <img src={selectedExercise.image} alt={selectedExercise.name} />
            <p><strong>Description:</strong> {selectedExercise.description}</p>
            <p><strong>Effect:</strong> {selectedExercise.effect}</p>
            <button onClick={() => setSelectedExercise(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Training;
