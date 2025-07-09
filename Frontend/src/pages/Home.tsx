import './Home.css';
import ernaehrung from '../assets/ernährung.png';   
import hantel from '../assets/hantel.png';      
import go4 from '../assets/go4.avif';
import challenges from '../assets/challenges.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthenti } from '../context/AuthentiContext';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthenti();



  return (
   
    <div >

<section className="hero-image-container">
  <img src={go4} alt="gochampion" className="gochampion-hero" />


  <div className="hero-text-overlay">
    <h1>{t('createWorkout')}</h1>
    <p>{t('withCompanion')}</p>
  </div>
</section>
     
      {/* CARDS-BEREICH */}
      <section id="membership-section" className="card-container">


        {!isAuthenticated && (
           <div className="intro-row">
          <p className="intro-text">To use the features, log in or become a member:</p>
         </div>
          )}

        {/* Workouts */}
        <div className="info-card">
          <h2 className='h2-nonetop'>My Workouts</h2>
          <Link to="/workouts">
            <img src={hantel} alt="Workout" className="card-image" />
          </Link>
          <p className="card-text">{t('createYourWorkouts')}</p>
        </div>

        {/* Nutrition */}
        <div className="info-card">
           <h2 className='h2-nonetop'>Nutrition</h2>
          <Link to="/nutrition">
            <img src={ernaehrung} alt="Nutrition" className="card-image" />
          </Link>
          <p className="card-text">{t('nutritionText')}</p>
        </div>

        {/* Challenges */}
        <div className="info-card">
           <h2 className='h2-nonetop'>Challenges</h2>
          <Link to="/challenges">
            <img src={challenges} alt="Gamification" className="card-image" />
          </Link>
          <p className="card-text">{t('gamificationText')}</p>
        </div>

      
        {!isAuthenticated && (
  <Link to="/register" className="becomeMember-box">
    <span className="avatar-text">{t('becomeMember')}</span>
  </Link>
)}
       

      </section>
    </div>
   
  );
};

export default Home;


