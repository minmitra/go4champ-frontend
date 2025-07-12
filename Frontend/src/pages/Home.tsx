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
    <div>
      {/* HERO SECTION */}
      <section className="hero-image-container">
        <img src={go4} alt="gochampion" className="gochampion-hero" />

        {/* Headline + Slogan */}
        <div className="hero-copy">
          <h1>{t('Unlock your full potential')}</h1>
          <p>{t('Train smart. Eat better. Win more.')}</p>
        </div>

        {/* Button – separat platziert */}
        {!isAuthenticated && (
          <Link to="/register" className="hero-cta-fixed">
            {t('becomeMember')}
          </Link>
        )}
      </section>

      {/* CARD SECTION */}
      <section id="membership-section" className="card-container">
        {/* Workouts */}
        <div className="info-card">
          <h2>My Workouts</h2>
          <Link to="/workouts">
            <img src={hantel} alt="Workout" className="card-image" />
          </Link>
          <p className="card-text card-text-shadow">
            {t(
              'With just a few clicks, our AI generates a personalized workout tailored to your goals and needs.'
            )}
          </p>
        </div>

        {/* Nutrition */}
        <div className="info-card">
          <h2>Nutrition</h2>
          <Link to="/nutrition">
            <img src={ernaehrung} alt="Nutrition" className="card-image" />
          </Link>
          <p className="card-text card-text-shadow">{t('nutritionText')}</p>
        </div>

        {/* Challenges */}
        <div className="info-card">
          <h2>Challenges</h2>
          <Link to="/challenges">
            <img src={challenges} alt="Gamification" className="card-image" />
          </Link>
          <p className="card-text card-text-shadow">{t('gamificationText')}</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
