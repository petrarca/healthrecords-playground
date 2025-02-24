import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/patients/:id" element={<Patient />} />
        <Route path="/patients/:id/timeline" element={<Patient />} />
        <Route path="/patients/:id/demographics" element={<Patient />} />
        <Route path="/patients/:id/summary" element={<Patient />} />
        <Route path="/patients/:id/profile" element={<Patient />} />
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