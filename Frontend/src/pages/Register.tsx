import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'
import { useTranslation } from 'react-i18next';




type RegisterForm = {
  email: string;
  username: string;
  name: string;
  age: string;
  gender: string;
  password: string;

};

const Register = () => {
   const { t } = useTranslation();
  const [formData, setFormData]
   = useState<RegisterForm>({
    email: '',
    username: '',
    name: '',
    age: '',
    gender: '',
    password: '',
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
      const requiredFields = [ 'email', 'username', 'password', 'age']
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
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/register',   {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        const message = isJson ? data.error?.toLowerCase() : data.toLowerCase();

       if(message?.includes("user")){
        setErrors({username: 'This username is already taken'});
        }
        else if(message?.includes('email')){
          setErrors({email: 'This email is already registered'});
        }
        else{
          setErrors({general: data || 'Registration failed'});
        }
        return;
      }
      alert("Registration successful! Please check your email to verify your account before logging in.")
      navigate('/login');
    }

    catch (err) {
      console.error(err);
      setErrors({general: 'Server error during registration'});
    }
  };

  return (
    <>

      <main>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className="register-h2">{t('register')}</h2>

          {errors.general && <p className="error">{errors.general}</p>}

          <input
              id="email"
              type="email"
              placeholder='*Email'
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error':''}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}

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
              id="name"
              type="text"
              placeholder='Displayname'
              value={formData.name}
              onChange={handleChange}
            />

            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'input-error':''}
            >
              <option value="">Gender</option>
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
              id="password"
              type="password"
              placeholder='*Password'
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error':''}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}

          <input type="submit" value="Register" className="primary-button" />
          {/* ABSCHNITT GEÄNDERT: className des Links von "register-link" zu "register" geändert, um ihrer Version zu entsprechen. */}
          <Link className="primary-button" to="/login">
            Already have an account? Login here
          </Link>
        </form>
      </main>
    </>
  );
};

export default Register;