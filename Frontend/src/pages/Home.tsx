import './Home.css';
import ernährung from '../assets/ernährung.png.png';
import hantel from '../assets/hantel.png.png';
import pixel from '../assets/pixel.png';
import freunde from '../assets/freunde.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long'
});

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="main-container">
        {/* HERO-BEREICH */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>{t('createWorkout')}</h1>
            <p>{t('withCompanion')}</p>
          </div>
          <div className="hero-image">
            <img src={pixel} alt="Pixel-character" className="pixel-hero" />
          </div>
        </section>

        {/* CARDS-BEREICH */}
        <div className="card-container">
          {/* Today's workout */}
          

          {/* Workouts */}
          <div className="info-card myworkouts-card">
            <Link to="/myworkout">
              <img src={hantel} alt="Workouts" className="card-image" />
              
            </Link>
            <p className="card-text workouts-text">
              {t('createYourWorkouts')}
            </p>
          </div>

          {/* Nutrition */}
          <div className="info-card nutrition-card">
            <Link to="/nutrition">
              <img src={ernährung} alt="Nutrition" className="card-image" />
              
            </Link>
            <p className="card-text nutrition-text">
              {t('nutritionText')}
            </p>
          </div>

          {/* Gamification */}
          <div className="info-card freunde-card">
            <Link to="/gamification">
              <img src={freunde} alt="Gamification" className="card-image" />
              
            </Link>
            <p className="card-text gamification-text">
              {t('gamificationText')}
            </p>
          </div>

          {/* Become a Member */}
          <div className="mitglied-button-wrapper">
            <Link to="/register" className="mitglied-button">
              {t('becomeMember')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
