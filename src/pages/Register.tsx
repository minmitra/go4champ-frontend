import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Register.css'


type RegisterForm = {
  username: string;
  password: string;
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
};

const Register = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isValidPassword = (pw: string) => {
    return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string} = {};

    Object.entries(formData).forEach(([key, value]) =>{
      const requiredFields = [ 'username', 'password', 'age']
      if(requiredFields.includes(key) && !value.trim()){
        newErrors[key] = 'This field is required';
      }
    });

    if(formData.age && Number(formData.age) < 16){
      newErrors.age = "Sorry, you're too young to use this App. Come back when you're 16!";
    }
   
    if (formData.password && !isValidPassword(formData.password)) {
      newErrors.password = 'Password has to be longer than eight characters and contain at least one letter and number.';
    }

     if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const payload={
      ...formData,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
    }

    try {
      const res = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
       if(data.error.includes("User already exists")){
        setErrors({username: 'This username is already taken'});
        }
        if(data.error.includes("Email already exists")){
          setErrors({email: 'This E-Mail is already registered'});
        }
        else{
          setErrors({general: data.error || 'Registration failed'});
        }
        return;
      }
      alert("Registration successfull")
      navigate('/login');
    } 

    catch (err) {
      console.error(err);
      setErrors({general: 'Server error during registration'});
    }
  };

  return (
    <>
      <Navigation />

      <main>
        <form onSubmit={handleSubmit} noValidate>
          <h2>Register</h2>

          {errors.general && <p className="error">{errors.general}</p>}

         
            <input
              id="username"
              type="text"
              placeholder='*Username'
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'input-error':''}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}

            <input
              id="password"
              type="password"
              placeholder='*Password'
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error':''}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <input
              id="name"
              type="text"
              placeholder='Name'
              value={formData.name}
              onChange={handleChange}
            />

            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'input-error':''}
              required
            >
              <option value="">* -- Please select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="diverse">Diverse</option>
            </select>
            {errors.gender && <p className="error">{errors.gender}</p>}
        
            <input
              id="age"
              type="number"
              placeholder='*Age'
              min={16}
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'input-error' : ''}
              required
            />
            {errors.age && <p className="error">{errors.age}</p>}

            <input
              id="weight"
              type="number"
              step={0.1}
              placeholder='Weight (kg)'
              value={formData.weight}
              onChange={handleChange}
              className={errors.weight ? 'input-error' : ''}
            />
            {errors.weight && <p className="error">{errors.weight}</p>}

            <input
              id="height"
              type="number"
              step={0.1}
              placeholder='Height (cm)'
              value={formData.height}
              onChange={handleChange}
              className={errors.height ? 'input-error' : ''}
            />
            {errors.height && <p className="error">{errors.height}</p>}

          <input type="submit" value="Register" />
          <Link className="register-link" to="/login">
            Already have an account? Login here
          </Link>
        </form>
      </main>
    </>
  );
};

export default Register;
