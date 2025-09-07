
import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Bell, Camera, Calendar, UserPlus, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { riskHistory, getDailyCalories } = useHealth();
  const navigate = useNavigate();

  const latestRisk = riskHistory[riskHistory.length - 1];
  const dailyCalories = getDailyCalories();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isPremium = profile?.subscription_plan === 'premium';

  return (
    <div className="page-layout bg-secondary">
      <div className="page-container">
        {/* Header */}
        <div className="pt-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {getGreeting()}, {profile?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-600">How are you feeling today?</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/subscription')}
                className="rounded-full"
              >
                {isPremium ? '⭐ Pro' : 'Upgrade'}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Score Card */}
            {latestRisk ? (
              <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Health Score</h2>
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl lg:text-4xl font-bold">{latestRisk.score}</span>
                        <Badge 
                          variant="secondary" 
                          className={`${getRiskColor(latestRisk.level)} text-white border-0`}
                        >
                          {latestRisk.level} Risk
                        </Badge>
                      </div>
                    </div>
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl lg:text-3xl">❤️</span>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mt-2">
                    {latestRisk.suggestions[0] || "Great job maintaining your health!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg lg:text-xl">Start Your Health Journey</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Take your first health risk assessment to get personalized insights
                  </p>
                  <Button 
                    onClick={() => navigate('/risk-scan')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Take Risk Assessment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/calorie-tracker')}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-green-600 text-lg">🍎</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{dailyCalories}</p>
                  <p className="text-xs text-gray-600">Calories Today</p>
                  <p className="text-xs text-blue-600 mt-1">Tap to track →</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-blue-600 text-lg">📊</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{riskHistory.length}</p>
                  <p className="text-xs text-gray-600">Health Checks</p>
                </CardContent>
              </Card>

              <Card 
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/chat-support')}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-purple-600 text-lg">💬</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-xs text-gray-600">Chat Support</p>
                  <p className="text-xs text-blue-600 mt-1">Get help →</p>
                </CardContent>
              </Card>

              <Card 
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/reports')}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-orange-600 text-lg">📋</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">View</p>
                  <p className="text-xs text-gray-600">Health Reports</p>
                  <p className="text-xs text-blue-600 mt-1">View all →</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={() => navigate('/risk-scan')}
                  className="justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  variant="outline"
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Daily Health Check
                </Button>

                <Button 
                  onClick={() => navigate('/nutrition-scan')}
                  className="justify-start bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  variant="outline"
                >
                  <Camera className="w-5 h-5 mr-3" />
                  Scan Food
                </Button>

                <Button 
                  onClick={() => navigate('/analytics')}
                  className="justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  variant="outline"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Analytics
                </Button>

                <Button 
                  onClick={() => navigate('/action-plan')}
                  className="justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                  variant="outline"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  View Action Plan
                </Button>

                {isPremium && (
                  <Button 
                    onClick={() => navigate('/family')}
                    className="justify-start bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 md:col-span-2"
                    variant="outline"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    Family Dashboard
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            {riskHistory.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riskHistory.slice(-3).reverse().map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Health Check</p>
                          <p className="text-xs text-gray-600">{new Date(risk.date).toLocaleDateString()}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getRiskColor(risk.level)} text-white border-0 text-xs`}
                        >
                          {risk.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Premium Upgrade Card */}
            {!isPremium && (
              <Card className="shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="font-semibold mb-2">Unlock Premium Features</h3>
                  <p className="text-purple-100 text-sm mb-4">
                    Get unlimited scans, AI coaching, and family monitoring
                  </p>
                  <Button 
                    onClick={() => navigate('/subscription')}
                    className="bg-white text-purple-600 hover:bg-gray-100 font-semibold w-full"
                  >
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
