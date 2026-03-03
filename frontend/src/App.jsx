import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import RegisterPatient from './pages/RegisterPatient';
import RegisterDoctor from './pages/RegisterDoctor';
import RegisterReceptionist from './pages/RegisterReceptionist';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register/patient" element={<RegisterPatient />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
          <Route path="/register/receptionist" element={<RegisterReceptionist />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
