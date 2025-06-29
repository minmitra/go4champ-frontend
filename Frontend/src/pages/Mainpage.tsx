import './Mainpage.css';
import ernährung from '../assets/ernährung.png';
import hantel from '../assets/hantel.png';
import challenges from '../assets/challenges.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import go4 from '../assets/go4.avif';




const Mainpage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
const today = new Intl.DateTimeFormat(i18n.language, {
  day: 'numeric',
  month: 'long'
}).format(new Date());

  return (
    <>
      <div className="main-container">
       <section className="hero-image-container">
  <img src={go4} alt="gochampion" className="gochampion-hero" />


  <div className="hero-text-overlay">
    <h1>{t('createWorkout')}</h1>
    <p>{t('withCompanion')}</p>
  </div>
</section>

        {/* CARDS-BEREICH */}
        <div className="card-container">

              {/* News */}
      <div className="info-card news-card">
  <h2>News</h2>
  <p className="card-text">Stay up to date:</p>
  <a
    href="https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen-US"
    target="_blank"
    rel="noopener noreferrer"
    className="primary-button"
  >
    Go to Google Sport News
  </a>
</div>

          {/* Today's workout */}
          <div className="info-card">
         <Link to="/todaysworkout">
         <p className="card-text-h2">{today}: {t('todaysWorkout')}</p>
         </Link>
        </div>


          {/* Workouts */}
          <div className="info-card">
             <h2>My Workouts</h2>
            <Link to="/myworkout">
              <img src={hantel} alt="Workouts" className="card-image" />
             
            </Link>
            <p className="card-text">
            {t('createYourWorkouts')}
            </p>
          </div>

          {/* Nutrition */}
          <div className="info-card">
             <h2>Nutrition</h2>
            <Link to="/nutrition">
              <img src={ernährung} alt="Nutrition" className="card-image" />
             
            </Link>
            <p className="card-text">
              {t('nutritionText')}
            </p>
          </div>

          {/* Gamification */}
          <div className="info-card ">
              <h2>Challenges</h2>
            <Link to="/gamification">
              <img src={challenges} alt="Gamification" className="card-image" />
             
            </Link>
            <p className="card-text">
              {t('gamificationText')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mainpage;