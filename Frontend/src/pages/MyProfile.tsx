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
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [availableEquipmentOptions, setAvailableEquipmentOptions] = useState<{[key: string]: string}>({});

  // State to store the original profile data (for cancelling changes)
  const [originalProfileData, setOriginalProfileData] = useState<any | null>(null);

  // State to control editing mode
  const [isEditing, setIsEditing] = useState(false);

  // State variables for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const equipmentOptions = [
    'Mat',
    'Dumbbells',
    'Resistance Band',
    'Kettlebell',
    'Pull-up Bar',
    'Jump Rope',
  ];

  useEffect(() => {
    if (token) {
      const username = getUsernameFromToken(token);
      if (username) {
        setLoggedInUsername(username);
      } else {
        setError(t('profile.tokenError'));
        setIsLoading(false);
      }
    } else {
      setError(t('profile.notLoggedIn'));
      setIsLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token || !loggedInUsername) return;

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
        console.error('Error fetching profile data:', err);
        setError(t('profile.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedInUsername) {
      fetchProfileData();
    }
  }, [loggedInUsername, token, t]);

  const handleEquipmentChange = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Handler for enabling edit mode
  const handleEditMode = () => {
    setIsEditing(true);
    setError(null); // Clear any previous errors when starting to edit
  };

  // Handler to save profile data
  const handleSave = async () => {
    if (!token || !loggedInUsername) {
      setError(t('profile.notLoggedInSave'));
      return;
    }

    const profileData = {
      // These fields are only sent if they are indeed editable in your backend via this endpoint.
      // Assuming username is NOT editable based on your disabled input.
      // If name/email ARE editable, uncomment these lines.
      // name,
      // email,
      age: age === '' ? null : age,
      weight: weight === '' ? null : weight,
      weightGoal: weightGoal === '' ? null : weightGoal,
      availableEquipment: equipment,
    };

    try {
      const data = await apiFetch<any>(`/user/${loggedInUsername}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      console.log('Profile saved:', data);
      alert(t('profile.saved'));
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
      console.error('Error saving profile:', err);
      setError(t('profile.saveError'));
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

  if (isLoading) {
    return <div className="profile-container">{t('profile.loading')}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {/* Edit-Link wird nur angezeigt, wenn man NICHT im Bearbeitungsmodus ist */}
        {!isEditing && (
          <span className="edit-profile-link" onClick={handleEditMode}>
            ✏️ Edit Profile
          </span>
        )}
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

      <label htmlFor="email">{t('profile.email')}</label>
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
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
