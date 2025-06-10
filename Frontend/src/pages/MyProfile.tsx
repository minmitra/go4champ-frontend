// src/components/MyProfile.tsx
import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Your CSS file for styling
import { apiFetch } from '../api/fetchClient'; // Adjust this path if 'apiFetch' is elsewhere
import { getUsernameFromToken } from '../utils/jwtUtils'; // Import the utility function

const MyProfile = () => {
  // State variables for profile data
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [weightGoal, setWeightGoal] = useState<number | ''>('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [availableEquipmentOptions, setAvailableEquipmentOptions] = useState<{[key: string]: string}>({});

  // State variables for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  // Effect to fetch available equipment options
  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        const data = await apiFetch<any>('/equipment/available');
        console.log('Equipment options received:', data);
        setAvailableEquipmentOptions(data.equipmentMap || {});
      } catch (err) {
        console.error('Fehler beim Laden der Equipment-Optionen:', err);
      }
    };

    fetchEquipmentOptions();
  }, []);

  // Effect to fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        setError('Sie sind nicht angemeldet. Bitte melden Sie sich an, um Ihr Profil anzuzeigen.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching profile data...');
        
        // Use the /me/profile endpoint
        const data = await apiFetch<any>('/me/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Profil-Daten vom Backend erhalten:', data);
        
        // WICHTIGER DEBUG: Zeige alle Felder einzeln an
        console.log('username:', data.username);
        console.log('name:', data.name);
        console.log('email:', data.email);
        console.log('age:', data.age);
        console.log('gender:', data.gender);
        console.log('height:', data.height);
        console.log('weight:', data.weight);
        console.log('weightGoal:', data.weightGoal);
        console.log('availableEquipment:', data.availableEquipment);

        // Set state with fetched data from your User entity
        setUsername(data.username || '');
        setName(data.name || '');
        setEmail(data.email || '');
        setAge(data.age === null || data.age === undefined ? '' : data.age);
        setGender(data.gender || '');
        setHeight(data.height === null || data.height === undefined ? '' : data.height);
        setWeight(data.weight === null || data.weight === undefined ? '' : data.weight);
        setWeightGoal(data.weightGoal === null || data.weightGoal === undefined ? '' : data.weightGoal);
        
        // Equipment aus availableEquipment setzen
        setEquipment(data.availableEquipment || []);

      } catch (err) {
        console.error('Fehler beim Abrufen der Profildaten:', err);
        if (err instanceof Error && err.message.includes('401')) {
          setError('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
        } else {
          setError('Fehler beim Laden der Profildaten. Bitte versuchen Sie es erneut.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  // Handler for equipment checkbox changes
  const handleEquipmentChange = (equipmentKey: string) => {
    setEquipment((prev) =>
      prev.includes(equipmentKey) ? prev.filter((i) => i !== equipmentKey) : [...prev, equipmentKey]
    );
  };

  // Handler to save profile data
  const handleSave = async () => {
    if (!token) {
      setError('Nicht angemeldet. Bitte melden Sie sich an, um Änderungen zu speichern.');
      return;
    }

    // Assemble profile data according to your User entity structure
    const profileData = {
      username, // Username from current state
      name,
      email,
      age: age === '' ? null : age,
      gender,
      height: height === '' ? null : height,
      weight: weight === '' ? null : weight,
      weightGoal: weightGoal === '' ? null : weightGoal,
      availableEquipment: equipment, // Das entspricht dem Feld in der User-Entity
    };

    try {
      console.log('Saving profile data:', profileData);
      
      const data = await apiFetch<any>('/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      
      console.log('Profil gespeichert:', data);
      alert('Profil erfolgreich gespeichert!');
      setError(null);
    } catch (err) {
      console.error('Fehler beim Speichern des Profils:', err);
      if (err instanceof Error && err.message.includes('401')) {
        setError('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
      } else {
        setError('Fehler beim Speichern der Profildaten. Bitte versuchen Sie es erneut.');
      }
    }
  };

  // Handler to cancel changes and reload original data
  const handleCancel = () => {
    // Reload the page to get fresh data
    window.location.reload();
  };

  // Display loading message
  if (isLoading) {
    return <div className="profile-container">Profil wird geladen...</div>;
  }

  // Render the profile form
  return (
    <div className="profile-container">
      <h2>Mein Profil</h2>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="username">Benutzername</label>
      <input
        id="username"
        type="text"
        value={username}
        disabled // Username sollte nicht änderbar sein
      />

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

      <label htmlFor="gender">Geschlecht</label>
      <select
        id="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Auswählen</option>
        <option value="MALE">Männlich</option>
        <option value="FEMALE">Weiblich</option>
        <option value="OTHER">Divers</option>
      </select>

      <label htmlFor="height">Größe (cm)</label>
      <input
        id="height"
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <label htmlFor="weight">Gewicht (kg)</label>
      <input
        id="weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <label htmlFor="weightGoal">Zielgewicht (kg)</label>
      <input
        id="weightGoal"
        type="number"
        value={weightGoal}
        onChange={(e) => setWeightGoal(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <hr />

      <label>Verfügbare Ausrüstung</label>
      <div className="equipment-options">
        {Object.entries(availableEquipmentOptions).map(([key, displayName]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={equipment.includes(key)}
              onChange={() => handleEquipmentChange(key)}
            />
            {displayName}
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