import React, { useState, useEffect } from 'react';
import './MyProfile.css';
import { apiFetch } from '../api/fetchClient';
import { getUsernameFromToken } from '../utils/jwtUtils';
import { useTranslation } from 'react-i18next';

const MyProfile = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
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
        const data = await apiFetch<any>(`/user/${loggedInUsername}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setName(data.name || '');
        setEmail(data.email || '');
        setAge(data.age ?? '');
        setWeight(data.weight ?? '');
        setFitnessLevel(data.fitnessLevel || '');
        setWorkoutGoal(data.workoutGoal || '');
        setEquipment(data.equipment || []);
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

  const handleSave = async () => {
    if (!token || !loggedInUsername) {
      setError(t('profile.notLoggedInSave'));
      return;
    }

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
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(t('profile.saveError'));
    }
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setAge('');
    setWeight('');
    setFitnessLevel('');
    setWorkoutGoal('');
    setEquipment([]);
    setError(null);
  };

  if (isLoading) {
    return <div className="profile-container">{t('profile.loading')}</div>;
  }

  return (
    <div className="profile-container">
      <h2>{t('profile.title')}</h2>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="name">{t('profile.name')}</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="email">{t('profile.email')}</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="age">{t('profile.age')}</label>
      <input
        id="age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <label htmlFor="weight">{t('profile.weight')}</label>
      <input
        id="weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      />

      <hr />

      <label htmlFor="fitnessLevel">{t('profile.fitnessLevel')}</label>
      <select
        id="fitnessLevel"
        value={fitnessLevel}
        onChange={(e) => setFitnessLevel(e.target.value)}
      >
        <option value="">{t('profile.select')}</option>
        <option value="beginner">{t('profile.beginner')}</option>
        <option value="intermediate">{t('profile.intermediate')}</option>
        <option value="advanced">{t('profile.advanced')}</option>
      </select>

      <label htmlFor="workoutGoal">{t('profile.workoutGoal')}</label>
      <select
        id="workoutGoal"
        value={workoutGoal}
        onChange={(e) => setWorkoutGoal(e.target.value)}
      >
        <option value="">{t('profile.select')}</option>
        <option value="muscle">{t('profile.muscle')}</option>
        <option value="cardio">{t('profile.cardio')}</option>
        <option value="fatloss">{t('profile.fatloss')}</option>
      </select>

      <label>{t('profile.equipment')}</label>
      <div className="equipment-options">
        {equipmentOptions.map((item) => (
          <label key={item}>
  {item}
  <input
    type="checkbox"
    checked={equipment.includes(item)}
    onChange={() => handleEquipmentChange(item)}
    style={{ marginLeft: 'auto' }}
  />
</label>

        ))}
      </div>

      <div className="buttons">
        <button className="save-btn" onClick={handleSave}>
          {t('profile.save')}
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          {t('profile.cancel')}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
