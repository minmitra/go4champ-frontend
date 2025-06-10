import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const VerifyEmail = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParam = new URLSearchParams(location.search);
    const token = queryParam.get('token');

    useEffect(() => {
        const verifyToken = async() =>{
            if(!token){
                setError('Missing verification token.');
                return;
            }

            try {
                const res = await fetch(`https://go4champ-backend-x.onrender.com/api/auth/verify-email?token=${token}`, {
                method: 'GET',
                });

                const data: string = await res.text();

                if(!res.ok){
                    setError(data || 'Email verification failed.');
                }
                else {
                    setMessage(data || 'Your email has been successfully verified! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 4000);
                }
            } catch (err) {
                console.error(err);
                setError('Server error while verifying email.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <main className="verify-email-container">
            <h2>Email Verification</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </main>
    );
};

export default VerifyEmail;