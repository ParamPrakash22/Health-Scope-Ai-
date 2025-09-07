
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { HealthProvider } from '@/contexts/HealthContext';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigation from '@/components/BottomNavigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import MealScannerFullscreen from '@/pages/MealScannerFullscreen';

// Pages
import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import RiskScan from '@/pages/RiskScan';
import NutritionScan from '@/pages/NutritionScan';
import CalorieTracker from '@/pages/CalorieTracker';
import ActionPlan from '@/pages/ActionPlan';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import FamilyDashboard from '@/pages/FamilyDashboard';
import Profile from '@/pages/Profile';
import Subscription from '@/pages/Subscription';
import ChatSupport from '@/pages/ChatSupport';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HealthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/risk-scan" element={<ProtectedRoute><RiskScan /></ProtectedRoute>} />
                <Route path="/nutrition-scan" element={<ProtectedRoute><NutritionScan /></ProtectedRoute>} />
                <Route path="/calorie-tracker" element={<ProtectedRoute><CalorieTracker /></ProtectedRoute>} />
                <Route path="/action-plan" element={<ProtectedRoute><ActionPlan /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/family" element={<ProtectedRoute><FamilyDashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path="/chat-support" element={<ProtectedRoute><ChatSupport /></ProtectedRoute>} />
                <Route path="/meal-scanner" element={
                  <ProtectedRoute>
                    <MealScannerFullscreen />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavigation />
            </div>
            <Toaster />
          </Router>
        </HealthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
