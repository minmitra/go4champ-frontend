import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './PasswordResetSuccess.css';

const PasswordResetSuccess: React.FC = () => {
    const [resendMessage, setResendMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleResend = async () => {
        setIsLoading(true);
        setResendMessage('');

        try {
            const res = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email: localStorage.getItem('resetEmail')}),
            });

            const data = await res.json();


            if (!res.ok) {
                setResendMessage( data.error || 'Faild to resend');
            }
            else{
                setResendMessage('Reset email resent successfully.')
            }
        } 
        catch (err) {
            console.error(err);
            setResendMessage('Server error. Please try again later');
        }
        setIsLoading(false);
    };
    
    const handleBackToLogin = () =>{
        navigate('/login');
    };

    return(
        <>
            <Navigation />
            
            <main className='password-reset-success-container'>
                
                <form>
                <h2>Reset Password</h2>
                <p>Reset link was send to your E-Mail successfuly!</p>

                <button onClick={handleResend} disabled={isLoading}>
                    {isLoading ? 'Resending...' : 'Resend E-Mail'}
                </button>

                <button onClick={handleBackToLogin} className='back-button'>
                    Back to login
                </button>

                {resendMessage && <p className='message'>{resendMessage}</p>}
            </form>
            </main>
        </>
        );
    };

    export default PasswordResetSuccess;
