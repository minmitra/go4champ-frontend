
import './Home.css';
import ernährung from '../assets/ernährung.png.png';
import hantel from '../assets/hantel.png.png';
import pixel from '../assets/pixel.png';
import freunde from '../assets/freunde.png';
import { Link } from 'react-router-dom';

const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long'
});



const Home = () => {
  return (
    <>
     

      <div className="home-container">

        {/* HERO-BEREICH */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>CREATE YOUR<br /> WORKOUT PLAN</h1>
            <p>With your personal companion</p>
          </div>
          <div className="hero-image">
            <img src={pixel} alt="Pixel-character" className="pixel-hero" />
          </div>

          

        </section>

        {/* CARDS-BEREICH */}
        <div className="card-container">
         
        {/* Todays-workout  */}
        <div className="info-card todays-workout-card">
           <Link to="/todaysworkout"> 
          </Link>
            <p className="card-text todaysworkout-text"> 
              {today}: Go to Today's workout</p>
        
        </div>

         {/* Workouts */}
        <div className="info-card myworkouts-card">
          <Link to="/myworkout">
          <img src={hantel} alt="Workouts" className="card-image" />
          </Link>
          <p className="card-text workouts-text">
          Create your workout<br /> 
          </p>
        </div>
         
         
          {/* Nutrition */}
          <div className="info-card nutrition-card">
         <Link to="/nutrition">
        <img src={ernährung} alt="Nutrition" className="card-image" />
       </Link>
       <p className="card-text nutrition-text">
      Create your personalized nutrition plan tailored to your preferences and allergies.
      </p>
      </div>
        

          {/* Gamification */}
          <div className="info-card freunde-card">
            <Link to="/gamification">
            <img src={freunde} alt="Gamification" className="card-image" />
            </Link>
            <p className="card-text gamification-text">
            Join exciting challenges with your friends and collect the most points!
            </p>
          </div>

          <div className="mitglied-button-wrapper">
          <Link to="/register" className="mitglied-button">Become a Member</Link>

          </div>


        </div>

      </div>
    </>
  );
};

export default Home;