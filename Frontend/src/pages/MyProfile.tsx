import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Your CSS file for styling
import { apiFetch } from '../api/fetchClient'; // Adjust this path if 'apiFetch' is elsewhere
// import { getUsernameFromToken } from '../utils/jwtUtils'; // This utility is not used here, can be removed if not needed elsewhere

const MyProfile = () => {
  // State variables for profile data (editable values)
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

  // State to store the original profile data (for cancelling changes)
  const [originalProfileData, setOriginalProfileData] = useState<any | null>(null);

  // State to control editing mode
  const [isEditing, setIsEditing] = useState(false);

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
        
        const data = await apiFetch<any>('/me/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Profil-Daten vom Backend erhalten:', data);
        
        // Set state with fetched data from your User entity
        setUsername(data.username || '');
        setName(data.name || '');
        setEmail(data.email || '');
        setAge(data.age === null || data.age === undefined ? '' : data.age);
        setGender(data.gender || '');
        setHeight(data.height === null || data.height === undefined ? '' : data.height);
        setWeight(data.weight === null || data.weight === undefined ? '' : data.weight);
        setWeightGoal(data.weightGoal === null || data.weightGoal === undefined ? '' : data.weightGoal);
        setEquipment(data.availableEquipment || []);

        // Store the original data for reverting changes
        setOriginalProfileData({
            username: data.username || '',
            name: data.name || '',
            email: data.email || '',
            age: data.age === null || data.age === undefined ? '' : data.age,
            gender: data.gender || '',
            height: data.height === null || data.height === undefined ? '' : data.height,
            weight: data.weight === null || data.weight === undefined ? '' : data.weight,
            weightGoal: data.weightGoal === null || data.weightGoal === undefined ? '' : data.weightGoal,
            equipment: data.availableEquipment || [],
        });

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

  // Handler for enabling edit mode
  const handleEditMode = () => {
    setIsEditing(true);
    setError(null); // Clear any previous errors when starting to edit
  };

  // Handler to save profile data
  const handleSave = async () => {
    if (!token) {
      setError('Nicht angemeldet. Bitte melden Sie sich an, um Änderungen zu speichern.');
      return;
    }

    // Assemble profile data according to your User entity structure
    const profileData = {
      // These fields are only sent if they are indeed editable in your backend via this endpoint.
      // Assuming username is NOT editable based on your disabled input.
      // If name/email ARE editable, uncomment these lines.
      // name,
      // email,
      age: age === '' ? null : age,
      gender,
      height: height === '' ? null : height,
      weight: weight === '' ? null : weight,
      weightGoal: weightGoal === '' ? null : weightGoal,
      availableEquipment: equipment,
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
      setIsEditing(false); // Exit edit mode after successful save
      // Update originalProfileData with the newly saved values
      setOriginalProfileData({
        ...originalProfileData, // Preserve username if it's truly not edited via form
        name: name, // If editable, update with current state
        email: email, // If editable, update with current state
        age: age === '' ? null : age,
        gender,
        height: height === '' ? null : height,
        weight: weight === '' ? null : weight,
        weightGoal: weightGoal === '' ? null : weightGoal,
        equipment: equipment,
      });

    } catch (err) {
      console.error('Fehler beim Speichern des Profils:', err);
      if (err instanceof Error && err.message.includes('401')) {
        setError('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
      } else {
        setError('Fehler beim Speichern der Profildaten. Bitte versuchen Sie es erneut.');
      }
    }
  };

  // Handler to cancel changes and revert to original data
  const handleCancel = () => {
    if (originalProfileData) {
      // Restore states to original values
      setUsername(originalProfileData.username);
      setName(originalProfileData.name);
      setEmail(originalProfileData.email);
      setAge(originalProfileData.age);
      setGender(originalProfileData.gender);
      setHeight(originalProfileData.height);
      setWeight(originalProfileData.weight);
      setWeightGoal(originalProfileData.weightGoal);
      setEquipment(originalProfileData.equipment);
    }
    setIsEditing(false); // Exit edit mode
    setError(null); // Clear any error messages
  };

  // Display loading message
  if (isLoading) {
    return <div className="profile-container">Profil wird geladen...</div>;
  }

  // Render the profile form
  return (
    <main>
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Input Felder */}
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        disabled // Username ist nicht editierbar
      />

      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      />

      <label htmlFor="age">Age</label>
      <input
        id="age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      />

      <label htmlFor="gender">Gender</label>
      <select
        id="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      >
        <option value="">Please Choose</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Divers</option>
      </select>

      <label htmlFor="height">Height (cm)</label>
      <input
        id="height"
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      />

      <label htmlFor="weight">Weight (kg)</label>
      <input
        id="weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      />

      <label htmlFor="weightGoal">Goal weight (kg)</label>
      <input
        id="weightGoal"
        type="number"
        value={weightGoal}
        onChange={(e) => setWeightGoal(e.target.value === '' ? '' : Number(e.target.value))}
        disabled={!isEditing} // Editierbar im Bearbeitungsmodus
      />

      <hr />

      <label>Available Equipment</label>
      <div className="equipment-options">
        {Object.entries(availableEquipmentOptions).map(([key, displayName]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={equipment.includes(key)}
              onChange={() => handleEquipmentChange(key)}
              disabled={!isEditing} // Editierbar im Bearbeitungsmodus
            />
            {displayName}
          </label>
        ))}
      </div>

      {/* Save/Cancel Buttons werden nur im Bearbeitungsmodus angezeigt */}
      {isEditing && (
        <div className="buttons">
          <button className="primary-button" onClick={handleSave}>
            Save
          </button>
          <button className="primary-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

       {/* Edit-Link wird nur angezeigt, wenn man NICHT im Bearbeitungsmodus ist */}
        {!isEditing && (
         <button
          type="button"
          className="primary-button"
        onClick={handleEditMode}
          >
          ✏️ Edit Profile
        </button>
        )}
    </div>
    </main>
  );
};

export default MyProfile;