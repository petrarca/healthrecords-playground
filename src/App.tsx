import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell';
import { LandingPage } from './components/LandingPage';
import { Patient } from './components/patient/Patient';
import { useNavigate } from 'react-router-dom';
import { navigationService } from './services/navigationService';
import { useEffect } from 'react';
import './services/searchProviders'; // Import to register providers

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient/:id" element={<Patient />} />
        <Route path="/patient/:id/timeline" element={<Patient />} />
        <Route path="/patient/:id/demographics" element={<Patient />} />
        <Route path="/patient/:id/summary" element={<Patient />} />
      </Routes>
    </Shell>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;