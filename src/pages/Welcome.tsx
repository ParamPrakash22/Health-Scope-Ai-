
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    console.log('Welcome page - user:', user, 'isLoading:', isLoading);
    
    if (!isLoading) {
      if (user) {
        console.log('User is authenticated, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('No user, showing welcome page');
        setShowContent(true);
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading spinner while auth is initializing
  if (isLoading) {
    console.log('Auth is loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sky-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">HealthScope AI</h2>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't show anything if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  // Don't show content until we're sure about auth state
  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sky-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">HealthScope AI</h2>
            <p className="text-gray-600">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-sky-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">HS</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HealthScope AI</h1>
            <p className="text-gray-600 text-lg">Your Personal Health Companion</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-sky-100 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-sky-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-sky-600 text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Health Risk Prediction</h3>
              <p className="text-sm text-gray-600">AI-powered analysis of your lifestyle habits</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-600 text-xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Smart Nutrition Scanning</h3>
              <p className="text-sm text-gray-600">Scan food labels and meals for instant nutrition insights</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Personalized Coaching</h3>
              <p className="text-sm text-gray-600">7-day action plans tailored to your health goals</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/signup')}
            className="w-full bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg"
          >
            Get Started Free
          </Button>
          
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 py-3 rounded-xl font-semibold"
          >
            Already have an account? Sign In
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          Trusted by thousands to live healthier, longer lives
        </div>
      </div>
    </div>
  );
};

export default Welcome;
