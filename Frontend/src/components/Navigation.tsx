import './Navigation.css';
import { useAuthenti } from '../context/AuthentiContext';
import platzhalter from '../assets/platzhalter.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaHome, FaBars } from 'react-icons/fa';

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
                        <button onClick={()=> alert("Menu clicked")}>
                            <FaBars size={20} />
                        </button>
                    </div>
                    <div className='center'>
                        <img src={platzhalter} alt="App Logo" className="logo"/>
                    </div>
                    <div className='right'>
                        <button onClick={handleLogout}>
                            <FaSignOutAlt size={20} />
                        </button>
                    </div>
                </div>
            ):(
                <div className='nav-logged-out'>
                    <div className="navigation-left">
                        <img src={platzhalter} alt="App Logo" className="logo"/>
                    </div>
                    <div className="navigation-right">
                        {location.pathname === '/' ? (
                            <Link to="/login" className="home-link">
                                <FaSignInAlt size={18} />
                            </Link>
                        ):(
                            <Link to="/" className="home-link">
                                <FaHome size={18} />
                            </Link>
                        )}        
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;