import { useState, useEffect } from 'react';
import './MyProfile.css';
import { type User, getMyProfile, updateMyProfile, getMyEquipment, updateMyEquipment, getAvailableEquipment } from '../api/user';

const MyProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [availableEquipmentMap, setAvailableEquipmentMap] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const user = await getMyProfile();
        const equipment = await getMyEquipment();
        const equipmentMap = await getAvailableEquipment();

        setProfile(user);
        setFormData({ ...user, availableEquipment: equipment });
        setAvailableEquipmentMap(equipmentMap);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Profildaten.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleInputChange = (field: keyof User, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleEquipmentChange = (key: string) => {
    if (!formData) return;
    const updated = formData.availableEquipment.includes(key)
      ? formData.availableEquipment.filter((e) => e !== key)
      : [...formData.availableEquipment, key];
    setFormData({ ...formData, availableEquipment: updated });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const updatedUser = await updateMyProfile(formData);
      await updateMyEquipment(formData.availableEquipment);
      setProfile(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Speichern fehlgeschlagen.');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) return <div>Profil wird geladen...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!formData) return null;

  return (
    <main>
      <div className="profile-container">
        <h1>My Profile</h1>

        <label>Username</label>
        <input 
          type="text" 
          value={formData.username} 
          disabled
          className={isEditing ? 'readonly' : ''}
        />

        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={!isEditing}
          className={isEditing ? 'editing' : ''}
        />

        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          disabled
          className={isEditing ? 'readonly' : ''}
        />

        <label>Gender</label>
        <select
          value={(formData as any).gender || ''}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          disabled={!isEditing}
          className={isEditing ? 'editing' : ''}
        >
          <option value="">Please Choose</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Divers</option>
        </select>

        <label>Age</label>
        <input
          type="number"
          value={formData.age === null ? '' : formData.age}
          onChange={(e) => handleInputChange('age', e.target.value === '' ? null : Number(e.target.value))}
          disabled={!isEditing}
          className={isEditing ? 'editing' : ''}
        />

        <label>Height (cm)</label>
        <input
          type="number"
          value={formData.height === null ? '' : formData.height}
          onChange={(e) => {
            const val = e.target.value;
            handleInputChange('height', val === '' ? null : Number(val));
          }}
         disabled={!isEditing}
         className={isEditing ? 'editing' : ''}
        />

        <label>Weight (kg)</label>
        <input
          type="number"
          value={formData.weight === null ? '' : formData.weight}
          onChange={(e) => {
            const val = e.target.value;
            handleInputChange('weight', val === '' ? null : Number(val));
          }}
          disabled={!isEditing}
          className={isEditing ? 'editing' : ''}
        />

        <label>Weight Goal (kg)</label>
        <input
          type="number"
          value={formData.weightGoal === null ? '' : formData.weightGoal}
          onChange={(e) => {
            const val = e.target.value;
            handleInputChange('weightGoal', val === '' ? null : Number(val))}
         
          }
          disabled={!isEditing}
          className={isEditing ? 'editing' : ''}
        />


        <label>Available Equipment</label>
        <div className="equipment-options">
          {Object.entries(availableEquipmentMap).map(([key, label]) => (
            <label key={key}>
              <input className='checkbox'
                type="checkbox"
                checked={formData.availableEquipment.includes(key)}
                onChange={() => handleEquipmentChange(key)}
                disabled={!isEditing}
              />
              {label}
            </label>
          ))}
        </div>


        {isEditing ? (
          <div>
            <button className="primary-button"onClick={handleSave}>Speichern</button>
            <button className="primary-button"onClick={handleCancel}>Abbrechen</button>
          </div>
        ) : (
          <button className="primary-button" onClick={() => setIsEditing(true)}>✏️Edit</button>
        )}
      </div>
    </main>
  );
};

export default MyProfile;
