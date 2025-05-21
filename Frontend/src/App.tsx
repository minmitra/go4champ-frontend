import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthentiProvider } from './context/AuthentiContext';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Login from './pages/Login'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import ErnaehrungPage from './pages/Ernaehrung';
import Footer from './components/Footer';

function App() {
  return (
    <AuthentiProvider>
      <Router>
        <Navigation />
  
        <div style ={{paddingTop: '60px'}}>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
            <Route path="/ernaehrung" element={<ErnaehrungPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthentiProvider>
  );
}

export default App;



