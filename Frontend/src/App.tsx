import { Routes, Route } from 'react-router-dom';

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
//import MyWorkout from './pages/MyWorkout';
import MyFriends from './pages/MyFriends';
import MyProfile from './pages/MyProfile';
//import TodaysWorkout from './pages/TodaysWorkout';
import Home from './pages/Home';
import Workoutdetail from './pages/WorkoutDetail';
import MyChallenges from './pages/MyChallenges';
import CoachChat from './components/CoachChat';
import Ranking from './pages/Ranking';
import FAQ from './pages/FAQ';
import { useLocation } from 'react-router-dom';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
// import MyCoach from './pages/MyCoach';


function App() {
  const location = useLocation();
  const privateRoutes = [
    '/mainpage',
    '/nutrition',
    '/myworkout',
    '/my-friends',
    '/challenges',
    '/myprofile',
    '/todaysworkout',
    '/ranking',
  ];

  const shouldShowCoachChat =
    privateRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/workoutdetail/');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Navigation />

      <div style={{ 
        flex: 1, 
        paddingTop: '60px' 
      }}>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/email-check" element={<CheckEmailRegister />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/faq" element={<FAQ />} />

            {/* PRIVATE ROUTE, nach dem login */}
            {/* <Route path='/MyCoach' element={<PrivateRoute><MyCoach /></PrivateRoute>} /> */}
            <Route path='/mainpage' element={<PrivateRoute><Mainpage /></PrivateRoute>} />
            <Route path="/workouts" element={<PrivateRoute><Workouts/></PrivateRoute>} />
            <Route path="/CreateWorkout" element={<PrivateRoute><CreateWorkout /></PrivateRoute>} />
            <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
           {/*  <Route path="/myworkout" element={<PrivateRoute><MyWorkout /></PrivateRoute>}/>*/}
            <Route path="/my-friends" element={<PrivateRoute><MyFriends/></PrivateRoute>}/>
            <Route path="/challenges" element={<PrivateRoute><MyChallenges/></PrivateRoute>}/>
            <Route path="/myprofile" element={<PrivateRoute><MyProfile/></PrivateRoute>}/>
            {/*<Route path="/todaysworkout" element={<PrivateRoute><TodaysWorkout/></PrivateRoute>}/>*/}
             <Route path="/ranking" element={<PrivateRoute><Ranking/></PrivateRoute>}/>
            <Route path="/workoutdetail/:workoutName" element={<Workoutdetail />} />
            
          </Routes>
        </div>
        <Footer />
       {shouldShowCoachChat && <CoachChat />}
    </div>
  );
}

export default App;



