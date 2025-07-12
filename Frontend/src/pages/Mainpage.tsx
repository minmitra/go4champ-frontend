import './Mainpage.css';
import ernaehrung from '../assets/ernährung.png';
import hantel from '../assets/hantel.png';
import challenges from '../assets/challenges.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Mainpage = () => {
  const { t, i18n } = useTranslation();

  const today = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="main-wrapper">
      {/* CARD SECTION */}
      <section className="card-container">
        {/* Today’s Workout */}
        <div className="info-card">
          <Link className="card-link" to="/workouts">
            <h2 className="card-headline">
              {today}: {t('todaysWorkout')}
            </h2>
          </Link>
        </div>

        {/* News */}
        <div className="info-card news-card">
          <h2 className="card-headline">News</h2>
          <p className="card-text">{t('Stay up to date')}</p>
          <a
            href="https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen-US"
            target="_blank"
            rel="noopener noreferrer"
            className="primary2-button"
          >
            Go to Google Sport News
          </a>
        </div>

        {/* Workouts */}
        <div className="info-card">
          <h2 className="card-headline">My Workouts</h2>
          <Link to="/workouts">
            <img src={hantel} alt="Workouts" className="card-image" />
          </Link>
          <p className="card-text">{t('createYourWorkouts')}</p>
        </div>

        {/* Nutrition */}
        <div className="info-card">
          <h2 className="card-headline">Nutrition</h2>
          <Link to="/nutrition">
            <img src={ernaehrung} alt="Nutrition" className="card-image" />
          </Link>
          <p className="card-text">{t('nutritionText')}</p>
        </div>

        {/* Challenges */}
        <div className="info-card">
          <h2 className="card-headline">Challenges</h2>
          <Link to="/challenges">
            <img src={challenges} alt="Gamification" className="card-image" />
          </Link>
          <p className="card-text">{t('gamificationText')}</p>
        </div>
      </section>
    </div>
  );
};

export default Mainpage;
