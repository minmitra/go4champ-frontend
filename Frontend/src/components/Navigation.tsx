import './Navigation.css';
import { useAuthenti } from '../context/AuthentiContext';
import platzhalter from '../assets/platzhalter.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation= () => {
    const {isAuthenticated, logout} = useAuthenti();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return(
        <header>
            {isAuthenticated ? (
                <div className ="nav-logged-in">
                    <div className="left">
                        <button onClick={()=> alert("Menu clicked")}>MENU</button>
                    </div>
                    <div className='center'>
                        <img src={platzhalter} alt="App Logo" className="logo"/>
                    </div>
                    <div className='right'>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            ):(
                <div className='nav-logged-out'>
                    <div className="navigation-left">
                        <img src={platzhalter} alt="App Logo" className="logo"/>
                    </div>
                    <div className="navigation-right">
                        {location.pathname === '/' ? (
                            <Link to="/login" className="home-link">Login</Link>
                        ):(
                            <Link to="/" className="home-link">Home</Link>
                        )}        
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;