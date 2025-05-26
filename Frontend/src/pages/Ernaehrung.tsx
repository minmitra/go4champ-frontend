import React from 'react';
import './Ernaehrung.css';

const ErnaehrungPage = () => {
  return (
    <div className="ernaehrung-page">
      <h1>Everything about your nutrition plan</h1>

      <h2>My Preferences:</h2>

<h3>What do you like to eat?</h3>
<div className="ernaehrung-options">
  <label><input type="checkbox" /> Fish</label>
  <label><input type="checkbox" /> Meat</label>
  <label><input type="checkbox" /> Vegetables</label>
  <label><input type="checkbox" /> Fruits</label>
</div>

<h3>Allergies or Dietary Preferences:</h3>
<div className="ernaehrung-options">
<label><input type="checkbox" /> Lactose intolerant</label>
<label><input type="checkbox" /> Vegan</label>
<label><input type="checkbox" /> Vegetarian</label>
<label><input type="checkbox" /> No fish</label>
</div>

<button className="save-button">Save</button>

    </div>

    
  );

  
};

export default ErnaehrungPage;
