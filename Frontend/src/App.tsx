import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Login from './pages/Login'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import Nutrition from './pages/Nutrition';
import Workout from './pages/Workout';
import WorkoutForm from './pages/WorkoutForm';
import Footer from './components/Footer';
import Mainpage from './pages/Mainpage';

function App() {
  return (
      <>
        <Navigation />
  
        <div style ={{paddingTop: '60px'}}>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/workout" element={<Workout/>} />
            <Route path="/mainpage" element={<Mainpage />} />
          </Routes>
        </div>
        <Footer />
      </>
  );
};

export default App;



