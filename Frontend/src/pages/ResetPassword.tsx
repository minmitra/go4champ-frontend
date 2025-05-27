import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import './Register.css'

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const[isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const[newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const[error, setError] = useState('');
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        const validateToken = async () => {
            try{
                const res = await fetch(`http://localhost:8080/api/auth/validate-reset-token?token=${token}`);
                const data = await res.json();
                
                if(!res.ok || !data.valid){
                    setError(data.message || 'Token is invalid or has expired');
                    setIsTokenValid(false);
                }
                else{
                    setIsTokenValid(true);
                }    
            } catch (err) {
                setError('Error validating token. Please try again later.');
                setIsTokenValid(false);
            }
        };

        if (token){
            validateToken();
        }
        else {
            setError('No token provided.');
            setIsTokenValid(false);
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if(!newPassword.trim()){
            setError('Please enter a new password.');
            setIsLoading(false);
            return;
        }

        try{
            const res = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({token, newPassword}),
            });

            const data = await res.json();


            if (!res.ok) {
                setError( data.error || 'Failed to reset the passwor d.');
            }
            else{
                navigate('/login');
            }
        } 
        catch (err) {
            setError('Server error. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    };

    if (isTokenValid === null) return <p>Loading...</p>;
    if (isTokenValid === false) return <p>{error}</p>;

    return(
        <main className="reset-password-container">
            <form onSubmit={handleSubmit}>
                <h2>New Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset password'} </button>
                {error && <p className="error">{error}</p>}
            </form>
        </main>
    )
};

export default ResetPassword;
