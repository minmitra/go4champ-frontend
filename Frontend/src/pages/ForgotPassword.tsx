import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors('');

    
        try {
            const res = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email}),
            });

            const data = await res.json();
 
            if (!res.ok) {
                setErrors( data.error || 'Something went wrong');
                return;
            }
            localStorage.setItem('resetEmail', email);
            navigate('/password-reset-success');
        } 
        catch (err) {
            console.error(err);
            setErrors('Server error. Please try again later');
        }
    };
        
    return(
        <>
            <Navigation />
            
            <main className='forgot-password-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    <label htmlFor='email'>
                        You will receive a link to reset your password. Please enter your registered E-Mail address:
                    </label>
                    <input
                        id="email"
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='E-Mail address'
                    />
                    <button type='submit' className="submit">
                        Receive link
                    </button>
                    <button type="button" onClick={()=> navigate('/login')} className='back-button'>
                        Back to Login
                    </button>
                    {errors && <p className='error'>{errors}</p>}
                </form>
        </main>
        </>
        );
    };

    export default ForgotPassword;
