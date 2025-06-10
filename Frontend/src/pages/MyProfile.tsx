// src/components/MyProfile.tsx
import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Your CSS file for styling
import { apiFetch } from '../api/fetchClient'; // Adjust this path if 'apiFetch' is elsewhere
import { getUsernameFromToken } from '../utils/jwtUtils'; // Import the utility function

const MyProfile = () => {
  // State variables for profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);

  // State variables for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  // State to hold the username extracted from the token
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  // Equipment options for checkboxes
  const equipmentOptions = [
    'Mat',
    'Dumbbells',
    'Resistance Band',
    'Kettlebell',
    'Pull-up Bar',
    'Jump Rope',
  ];

  // Effect to extract username from token when the component mounts or token changes
  useEffect(() => {
    if (token) {
      const username = getUsernameFromToken(token);
      if (username) {
        setLoggedInUsername(username);
      } else {
        // This means the token is present but couldn't be decoded or is invalid/expired
        setError('Problem mit Ihrem Anmeldetoken. Bitte melden Sie sich erneut an.');
        setIsLoading(false);
      }
    } else {
      // No token found at all
      setError('Sie sind nicht angemeldet. Bitte melden Sie sich an, um Ihr Profil anzuzeigen.');
      setIsLoading(false);
    }
  }, [token]); // Re-run if the token itself changes

  // Effect to fetch profile data once the username is available
  useEffect(() => {
    const fetchProfileData = async () => {
      // Only proceed if we have a valid token AND a username extracted from it
      if (!token || !loggedInUsername) {
        // Error will already be set by the previous useEffect if token/username is missing
        return;
      }

      try {
        // Use the /user/{username} endpoint as per your Swagger spec
        const data = await apiFetch<any>(`/user/${loggedInUsername}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token for authorization
          },
        });

        console.log('Profil-Daten vom Backend erhalten:', data); // **Sehr wichtig:** Prüfe dies in der Konsole!

        // Set state with fetched data, providing fallbacks for null/undefined values
        // **IMPORTANT:** Adjust these keys (e.g., data.name) if your backend response
        // has a different structure (e.g., data.user.name, data.profile.name)
        setName(data.name || '');
        setEmail(data.email || '');
        setAge(data.age === null || data.age === undefined ? '' : data.age);
        setWeight(data.weight === null || data.weight === undefined ? '' : data.weight);
        setFitnessLevel(data.fitnessLevel || '');
        setWorkoutGoal(data.workoutGoal || '');
        setEquipment(data.equipment || []); // Ensure it's an array

      } catch (err) {
        console.error('Fehler beim Abrufen der Profildaten:', err);
        setError('Fehler beim Laden der Profildaten. Bitte versuchen Sie es erneut.');
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    // Only call fetchProfileData if loggedInUsername is set
    if (loggedInUsername) {
      fetchProfileData();
    }
  }, [loggedInUsername, token]); // Depends on both token and the extracted username

  // Handler for equipment checkbox changes
  const handleEquipmentChange = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Handler to save profile data
  const handleSave = async () => {
    if (!token || !loggedInUsername) {
      setError('Nicht angemeldet. Bitte melden Sie sich an, um Änderungen zu speichern.');
      return;
    }

    // Assemble profile data
    const profileData = {
      name,
      email,
      age: age === '' ? null : age,
      weight: weight === '' ? null : weight,
      fitnessLevel,
      workoutGoal,
      equipment,
    };

    try {
      // **IMPORTANT:** If your backend's PUT endpoint for profile updates is also /user/{username},
      // adjust this path similarly. If it's still /profile and it automatically uses the JWT,
      // then the path is fine as is. Assuming it's /user/{username} for consistency.
      const data = await apiFetch<any>(`/user/${loggedInUsername}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      console.log('Profil gespeichert:', data);
      alert('Profil erfolgreich gespeichert!');
      setError(null); // Clear any previous errors on successful save
    } catch (err) {
      console.error('Fehler beim Speichern des Profils:', err);
      setError('Fehler beim Speichern der Profildaten. Bitte versuchen Sie es erneut.');
    }
  };

  // Handler to cancel changes and revert (currently clears form)
  const handleCancel = () => {
    // For a true "cancel," you'd typically re-fetch the data or store a copy of the original data.
    // For simplicity, this clears the form and any errors.
    setName('');
    setEmail('');
    setAge('');
    setWeight('');
    setFitnessLevel('');
    setWorkoutGoal('');
    setEquipment([]);
    setError(null);
  };

  // Display loading message
  if (isLoading) {
    return <div className="profile-container">Profil wird geladen...</div>;
  }

  // Render the profile form
  return (
    <div className="profile-container">
      <h2>Mein Profil</h2>

      {error && <p className="error-message">{error}</p>} {/* Error display */}

      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="age">Alter</label>
      <input
        id="age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <label htmlFor="weight">Gewicht (kg)</label>
      <input
        id="weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <hr />

      <label htmlFor="fitnessLevel">Fitnesslevel</label>
      <select
        id="fitnessLevel"
        value={fitnessLevel}
        onChange={(e) => setFitnessLevel(e.target.value)}
      >
        <option value="">Auswählen</option>
        <option value="beginner">Anfänger</option>
        <option value="intermediate">Fortgeschritten</option>
        <option value="advanced">Experte</option>
      </select>

      <label htmlFor="workoutGoal">Trainingsziel</label>
      <select
        id="workoutGoal"
        value={workoutGoal}
        onChange={(e) => setWorkoutGoal(e.target.value)}
      >
        <option value="">Auswählen</option>
        <option value="muscle">Muskelaufbau</option>
        <option value="cardio">Cardio</option>
        <option value="fatloss">Fettabbau</option>
      </select>

      <label>Ausrüstung</label>
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
        <button className="save-btn" onClick={handleSave}>
          Speichern
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default MyProfile;