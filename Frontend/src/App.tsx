import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Login from './pages/Login'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import Nutrition from './pages/Nutrition';
import Footer from './components/Footer';
import Mainpage from './pages/Mainpage';
import VerifyEmail from './pages/VerifyEmail';
import PrivateRoute from './routes/PrivateRoute';
import CheckEmailRegister from './pages/CheckEmailRegister';
import ResetPassword from './pages/ResetPassword';
import Training from './pages/Training';
import MyWorkout from './pages/MyWorkout';
import Gamification from './pages/Gamification';
import MyProfile from './pages/MyProfile';
import TodaysWorkout from './pages/TodaysWorkout';
import Workoutdetail from './pages/Workoutdetail';


function App() {
  return (
      <>
        <Navigation />
  
        <div style ={{paddingTop: '60px'}}>
        
          <Routes>
<<<<<<< HEAD
            <Route path="/" element={<MyWorkout />} />
=======
            <Route path="/" element={<Workoutdetail />} />
>>>>>>> b87f61772e4162e14d226a635d3a076622c66cb5
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/email-check" element={<CheckEmailRegister />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* PRIVATE ROUTE, nach dem login */}
            <Route path='/mainpage' element={<PrivateRoute><Mainpage /></PrivateRoute>} />
            <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
            <Route path="/myworkout" element={<PrivateRoute><MyWorkout /></PrivateRoute>}/>
            <Route path="/gamification" element={<PrivateRoute><Gamification/></PrivateRoute>}/>
            <Route path="/myprofile" element={<PrivateRoute><MyProfile/></PrivateRoute>}/>
            <Route path="/todaysworkout" element={<PrivateRoute><TodaysWorkout/></PrivateRoute>}/>
            <Route path="/training" element={<PrivateRoute><Training /></PrivateRoute>} />

             NEU: Detaillierte Workout-Ansicht
          <Route path="/workout/:workoutName" element={
            <PrivateRoute><Workoutdetail /></PrivateRoute>
          } />
          
          </Routes>
        </div>
        <Footer />
      </>
  );
};

export default App;



