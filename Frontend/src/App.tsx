import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Login from './pages/Login'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import Nutrition from './pages/Nutrition';
import Workout from './pages/Workout';
import Footer from './components/Footer';
import Mainpage from './pages/Mainpage';
import VerifyEmail from './pages/VerifyEmail';
import PrivateRoute from './routes/PrivateRoute';
import CheckEmailRegister from './pages/CheckEmailRegister';
import ResetPassword from './pages/ResetPassword';

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
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/email-check" element={<CheckEmailRegister />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* PRIVATE ROUTE, nach dem login */}
            <Route path='/mainpage' element={<PrivateRoute><Mainpage /></PrivateRoute>} />
            <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
            <Route path="/workout" element={<PrivateRoute><Workout /></PrivateRoute>} />
          </Routes>
        </div>
        <Footer />
      </>
  );
};

export default App;



