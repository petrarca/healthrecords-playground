import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Shell } from './components/Shell';
import { LandingPage } from './components/LandingPage';
import { Patient } from './components/patient/Patient';
import { navigationService } from './services/navigationService';
import { useEffect } from 'react';
import './services/search/patientSearchProviders'; // Import to register providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { contextService } from './services/contextService';
import { ContextProvider } from './components/ContextProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);

  // Initialize context service with current URL
  useEffect(() => {
    contextService.updateFromUrl(location.pathname);
  }, [location.pathname]);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patients/:id" element={<Patient />} />
        <Route path="/patients/:id/timeline" element={<Patient />} />
        <Route path="/patients/:id/timeline/:recordId" element={<Patient />} />
        <Route path="/patients/:id/demographics" element={<Patient />} />
        <Route path="/patients/:id/summary" element={<Patient />} />
        <Route path="/patients/:id/profile" element={<Patient />} />
      </Routes>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ContextProvider>
          <AppContent />
        </ContextProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;