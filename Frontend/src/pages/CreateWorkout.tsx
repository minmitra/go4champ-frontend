import './Workouts.css';
import React, { useEffect, useState } from 'react';
import './CreateWorkout.css';
import { motion } from 'framer-motion';
import avatar from '../assets/pixel.png';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/fetchClient';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

interface GeneratedExercise {
  title: string;
  duration: number;
  difficulty: number;
  typeString: string;
  description: string;
}

type WorkoutData = {
  bodyPart: string;
  exercises: string;
  location: string;
  workoutName: string;
  generatedExercises?: GeneratedExercise[];
  rawAiResponse?: string;
};

const defaultDummyExercises: GeneratedExercise[] = [
  { title: 'Default Squats', duration: 30, difficulty: 3.5, typeString: 'Indoor', description: 'Basic bodyweight squats.' },
  { title: 'Default Lunges', duration: 25, difficulty: 3.0, typeString: 'Outdoor', description: 'Alternating lunges for legs.' },
  { title: 'Default Plank', duration: 60, difficulty: 4.0, typeString: 'Indoor', description: 'Hold plank for core strength.' }
];

const CreateWorkout = () => {
    
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WorkoutData>({
    bodyPart: '',
    exercises: '',
    location: '',
    workoutName: '',
    generatedExercises: undefined,
    rawAiResponse: undefined
  });
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutData[]>(() => {
    const saved = localStorage.getItem('savedWorkouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  const steps = ['bodyPart', 'exercises', 'location', 'summary'];
  const questions: Record<string, string> = {
    bodyPart: 'Which body part do you want to train?',
    exercises: 'How many exercises do you want in the workout?',
    location: 'Where are you right now?',
    summary: 'Ready to generate your workout plan?'
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
  if (!formData.workoutName.trim()) {
    alert('Please enter a workout name before creating.');
    return;
  }

  if (editingIndex !== null) {
    setSavedWorkouts(prev => {
      const copy = [...prev];
      copy[editingIndex] = formData;
      return copy;
    });
    setEditingIndex(null);
    setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
    setStep(0);
    setShowForm(false);
    alert('Workout successfully updated.');
    return;
  }

  setIsGenerating(true);
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to generate a workout.');
    setIsGenerating(false);
    return;
  }

  try {
    const prompt = `Create a ${formData.exercises} exercises ${formData.bodyPart} workout plan for ${formData.location}.`;
    console.log('Prompt sent to AI:', prompt);

    const response = await apiFetch<{ antwort: string; plan: string }>(`/api/ai/chat-create-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ prompt })
    });

    console.log('AI response:', response);

    let parsedExercises: GeneratedExercise[] = [];

    if (response.antwort) {
      try {
        const jsonMatch = response.antwort.match(/\[\s*\{.*?\}\s*(?:,\s*\{.*?\}\s*)*\]/s);
        if (jsonMatch && jsonMatch[0]) {
          parsedExercises = JSON.parse(jsonMatch[0]);
          console.log('Parsed exercises:', parsedExercises);
        } else {
          console.warn('No parsable JSON array found in AI response.');
          parsedExercises = defaultDummyExercises;
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        parsedExercises = defaultDummyExercises;
      }
    } else {
      console.warn('No "antwort" field in AI response.');
      parsedExercises = defaultDummyExercises;
    }

    const newWorkout: WorkoutData = {
      ...formData,
      generatedExercises: parsedExercises,
      rawAiResponse: response.antwort
    };

    setSavedWorkouts(prev => [newWorkout, ...prev]);
    setFormData({ bodyPart: '', exercises: '', location: '', workoutName: '' });
    setStep(0);
    setShowForm(false);

    alert('Workout plan successfully generated and saved!');

    navigate('/Workouts'); //neu wegen link zu workout

  } catch (error) {
    console.error('Error generating workout plan:', error);
    alert('An error occurred while generating your workout. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};
return (
    <main>
      <div>
        <div>
          <h1>Create your workout</h1>
          {!showForm && (
  <button onClick={() => setShowForm(true)}>
    Start Creating Workout
  </button>
)}
          {showForm && (
            <div >
              <div className="question-header">
                <img src={avatar} className="avatar-image" alt="avatar" />
                <div className="speech-bubble">{questions[steps[step]]}</div>
              </div>

              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                {steps[step] === 'bodyPart' && (
                  <div className="workout-options labelS">
                    {['Arms', 'Back', 'Abs', 'Legs', 'Glutes', 'Full Body'].map(part => (
                      <label key={part}>
                        <input
                          type="radio"
                          name="bodyPart"
                          checked={formData.bodyPart === part}
                          onChange={() => handleInputChange('bodyPart', part)}
                        />
                        {part}
                      </label>
                    ))}
                  </div>
                )}

                {steps[step] === 'exercises' && (
                  <div className="workout-options labelS">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <label key={num}>
                        <input
                          type="radio"
                          name="exercises"
                          checked={formData.exercises === String(num)}
                          onChange={() => handleInputChange('exercises', String(num))}
                        />
                        {num}
                      </label>
                    ))}
                  </div>
                )}

                {steps[step] === 'location' && (
                  <div className="workout-options labelS">
                    {['Home', 'Gym', 'Outdoor'].map(place => (
                      <label key={place}>
                        <input
                          type="radio"
                          name="location"
                          checked={formData.location === place}
                          onChange={() => handleInputChange('location', place)}
                        />
                        {place}
                      </label>
                    ))}
                  </div>
                )}

                {steps[step] === 'summary' && (
                  <div className="summary-container">
                    <label htmlFor="workoutName">Workout Name:</label>
                    <input
                      type="text"
                      id="workoutName"
                      value={formData.workoutName}
                      onChange={e => handleInputChange('workoutName', e.target.value)}
                      placeholder="Enter workout name"
                    />
                    <p>You're ready!</p>
                  </div>
                )}
              </motion.div>

              <div className="navigation-buttons-pages">
                  {step === 0 ? (
                  <button
                        className="navigation-button-pages"
                        onClick={() => navigate('/Workouts')}
                        disabled={isGenerating}
                            >   
                        <FaAngleLeft className="left-icon" />Exit
                 </button>
                  ) : (
                    <button className="navigation-button-pages" onClick={handleBack} disabled={isGenerating}>
                       <FaAngleLeft className="left-icon" />Back
                    </button>
                  )}
                  {step < steps.length - 1 ? (
                    <button  className="navigation-button-pages right-align" onClick={handleNext} disabled={isGenerating}>
                     Next <FaAngleRight className="right-icon" />
                    </button>
                  ) : (
                    <button className="primary-button" onClick={handleSubmit} disabled={isGenerating}>
                      {isGenerating ? 'Generating...' : (editingIndex !== null ? 'Save Changes' : 'Create Workout')}
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateWorkout;

