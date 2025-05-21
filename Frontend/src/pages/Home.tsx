
import './Home.css';
import Navigation from '../components/Navigation';
import ernaehrung from '../assets/ernährung.png.png';
import hantel from '../assets/hantel.png.png';
import pixel from '../assets/pixel.png';
import freunde from '../assets/freunde.png';
import { Link } from 'react-router-dom';



const Home = () => {
  return (
    <>
      <Navigation />

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

          {/* Ernährungs-Box */}
          <div className="info-card ernaehrung-card">
  <Link to="/ernaehrung">
    <img src={ernaehrung} alt="Nutrition" className="card-image" />
  </Link>
  <p className="card-text ernaehrung-text">
  Create your personalized nutrition plan tailored to your preferences and allergies.
  </p>
</div>

          {/* Hantel-Box */}
          <div className="info-card hantel-card">
            <img src={hantel} alt="Workout Plan" className="card-image" />
            <p className="card-text hantel-text">
            Your coach creates a fully customized workout plan based on your goals and available equipment.
            </p>
          </div>

          {/* Freunde-Box */}
          <div className="info-card freunde-card">
            <img src={freunde} alt="Freunde Challenge" className="card-image" />
            <p className="card-text freunde-text">
            Join exciting challenges with your friends and collect the most points!
            </p>
          </div>

          <div className="mitglied-button-wrapper">
          <a href="/register" className="mitglied-button">Become a Member</a>
          </div>


        </div>

      </div>
    </>
  );
};

export default Home;