import React, { useState } from 'react';
import './MyProfile.css';

const MyProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);

  const handleEquipmentChange = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    const profileData = {
      name,
      email,
      age,
      weight,
      fitnessLevel,
      workoutGoal,
      equipment,
    };
    console.log('Saved profile data:', profileData);
    // Später: API-Call zum Speichern
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setAge('');
    setWeight('');
    setFitnessLevel('');
    setWorkoutGoal('');
    setEquipment([]);
  };

  const equipmentOptions = [
    'Mat',
    'Dumbbells',
    'Resistance Band',
    'Kettlebell',
    'Pull-up Bar',
    'Jump Rope',
  ];

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <label>Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Age</label>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
      />

      <label>Weight (kg)</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value === '' ? '' : parseInt(e.target.value))}
      />

      <hr />

      <label>Fitness Level</label>
      <select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
        <option value="">Select</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <label>Workout Goal</label>
      <select value={workoutGoal} onChange={(e) => setWorkoutGoal(e.target.value)}>
        <option value="">Select</option>
        <option value="muscle">Muscle Gain</option>
        <option value="cardio">Cardio</option>
        <option value="fatloss">Fat Loss</option>
      </select>

      <label>Equipment</label>
      <div className="equipment-options">
        {equipmentOptions.map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={equipment.includes(item)}
              onChange={() => handleEquipmentChange(item)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className="buttons">
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );

  
};

export default MyProfile;