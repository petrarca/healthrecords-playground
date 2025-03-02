import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Shell } from './components/Shell';
import { ShellContext } from './context/ShellContext';
import { LandingPage } from './components/LandingPage';
import { Patient } from './components/patient/Patient';
import { navigationService } from './services/navigationService';
import { useEffect } from 'react';
import './services/search/patientSearchProviders'; // Import to register providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { contextService } from './services/contextService';
import { ContextProvider } from './components/ContextProvider';
import { QuantityInputDemo } from './components/demo/QuantityInputDemo';
import { JsonRendererDemo } from './components/demo/JsonRendererDemo';
import { FieldRenderersDemo } from './components/demo/FieldRenderersDemo';
import { AddressCardDemo } from './components/demo/AddressCardDemo';
import { DeveloperPage } from './components/DeveloperPage';

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
    // Only update context for non-patient routes
    // Patient routes will be handled by the Patient component
    if (!location.pathname.includes('/patients/')) {
      contextService.updateFromUrl(location.pathname);
    }
  }, [location.pathname]);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<ShellContext.Consumer>
          {({ onAssistantClick }) => <LandingPage onAssistantClick={onAssistantClick} />}
        </ShellContext.Consumer>} />
        <Route path="/patients/:id" element={<Patient />} />
        <Route path="/patients/:id/timeline" element={<Patient />} />
        <Route path="/patients/:id/timeline/:recordId" element={<Patient />} />
        <Route path="/patients/:id/demographics" element={<Patient />} />
        <Route path="/patients/:id/summary" element={<Patient />} />
        <Route path="/patients/:id/profile" element={<Patient />} />
        <Route path="/patients/:id/vitals" element={<Patient />} />
        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="/demo/quantity-input" element={<QuantityInputDemo />} />
        <Route path="/demo/json-renderer" element={<JsonRendererDemo />} />
        <Route path="/demo/field-renderers" element={<FieldRenderersDemo />} />
        <Route path="/demo/address-card" element={<AddressCardDemo />} />
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