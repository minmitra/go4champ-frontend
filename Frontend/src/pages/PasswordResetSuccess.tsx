import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';




const PasswordResetSuccess: React.FC = () => {
    const [resendMessage, setResendMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const resetEmail = localStorage.getItem('resetEmail') || '';


    const handleResend = async () => {
        if(!resetEmail) {
            setResendMessage('An account with this email does not exist.');
            return;
        }
        setIsLoading(true);
        setResendMessage('');

        try {
            const res = await fetch('https://go4champ-backend-x.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email: resetEmail}),
            });

            const data = await res.json();


            if (!res.ok) {
                setResendMessage( data.error || 'Failed to resend');
            }
            else{
                setResendMessage('Reset link was sent to your email successfully.')
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
            
            <main className='password-reset-success-container'>
                
                <form>
                <h2>Reset Password</h2>
                <p>Reset link was send to your E-Mail successfuly!</p>

                <button onClick={handleResend}  type="button"     className="primary-button">
                    {isLoading ? 'Resending...' : 'Resend email'}
                </button>

                <button onClick={handleBackToLogin}  type="button"    className="primary-button" >
                    Back to login
                </button>

                {resendMessage && <p className='message'>{resendMessage}</p>}
            </form>
            </main>
        </>
        );
    };

    export default PasswordResetSuccess;
