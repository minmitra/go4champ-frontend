import React, { useState } from 'react';
import './Nutrition.css';

interface Recipe {
  title: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: string[];
  instructions: string;
}

const Nutrition = () => {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);

  const handleGenerate = () => {
    const newRecipe: Recipe = {
      title: 'Tofu Salad',
      calories: 420,
      protein: 28,
      fat: 16,
      carbs: 32,
      ingredients: ['150 g tofu (cooked)', '1 avocado', '1 cup baby spinach', 'Cherrytomatoes', '1 tbsp olive oil'],
      instructions: '1. Tofu würfeln und in Olivenöl anbraten. 2. Gemüse schneiden. 3. Alles mischen. 4. Optional Dressing hinzufügen.'
    };
    setRecipes([newRecipe, ...recipes]);
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiet(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const handleDelete = (index: number) => {
    setRecipes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main>

      <div className="nutrition-header">
        <h1>Nutrition</h1>
      </div>

      <div className="nutrition-container">
        <div className="nutrition-sidebar">
          <h2 className='h2-nonetop '>Meal Type</h2>
          {['Breakfast', 'Lunch', 'Dinner'].map(type => (
            <button
              key={type}
              className={selectedMealType === type ? 'selected' : ''}
              onClick={() => setSelectedMealType(type)}
            >
              {type}
            </button>
          ))}

          <h2 className='h2-nonetop'> Diet</h2>
          {['Vegan', 'Vegetarian', 'Low Carb', 'High Protein'].map(diet => (
            <button
              key={diet}
              className={selectedDiet.includes(diet) ? 'selected' : ''}
              onClick={() => toggleDiet(diet)}
            >
              {diet}
            </button>
          ))}
        </div>

        <div className="nutrition-input">
          <p>What are you craving?</p>
          <textarea
            className="input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Something with chicken and carrots"
          />
          <button className="primary-button" onClick={handleGenerate}>
            Generate
          </button>
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="nutrition-input">
          <h2 className='recipes-h2'>My Recipes</h2>
          {recipes.map((recipe, idx) => (
            <div key={idx} className="recipe-card">
              <div className="recipe-header">
                <h3>{recipe.title}</h3>
                <button className="delete-btn" onClick={() => handleDelete(idx)}>🗑️</button>
              </div>
              <p><strong>Calories:</strong> {recipe.calories} kcal | <strong>Protein:</strong> {recipe.protein} g | <strong>Fat:</strong> {recipe.fat} g | <strong>Carbs:</strong> {recipe.carbs} g</p>
              <p><strong>Ingredients:</strong></p>
              <ul>
                {recipe.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <details>
                <summary>Click for prep</summary>
                <p>{recipe.instructions}</p>
              </details>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Nutrition;
