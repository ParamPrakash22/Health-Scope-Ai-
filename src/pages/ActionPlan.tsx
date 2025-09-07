import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Bell } from 'lucide-react';

const ActionPlan = () => {
  const { profile } = useAuth();
  const { riskHistory, currentHealthData } = useHealth();
  const navigate = useNavigate();

  const latestRisk = riskHistory[riskHistory.length - 1];

  const generateActionPlan = () => {
    const plan = [];
    
    // Sleep recommendations
    if (currentHealthData.sleepHours < 7) {
      plan.push({
        category: 'Sleep',
        priority: 'High',
        action: 'Establish a consistent bedtime routine',
        details: 'Aim for 7-9 hours of sleep. Go to bed and wake up at the same time daily.',
        icon: '😴',
        color: 'bg-blue-50 border-blue-200',
      });
    }

    // Water intake
    if (currentHealthData.waterIntake < 2.5) {
      plan.push({
        category: 'Hydration',
        priority: 'Medium',
        action: 'Increase daily water intake',
        details: 'Drink a glass of water upon waking and before each meal.',
        icon: '💧',
        color: 'bg-cyan-50 border-cyan-200',
      });
    }

    // Exercise
    if (currentHealthData.exerciseFrequency < 4) {
      plan.push({
        category: 'Exercise',
        priority: 'High',
        action: 'Increase physical activity',
        details: 'Start with 30 minutes of walking daily, then add strength training.',
        icon: '🏃‍♂️',
        color: 'bg-green-50 border-green-200',
      });
    }

    // Stress management
    if (currentHealthData.stressLevel > 6) {
      plan.push({
        category: 'Stress',
        priority: 'High',
        action: 'Practice stress reduction techniques',
        details: 'Try 10 minutes of meditation or deep breathing exercises daily.',
        icon: '🧘‍♀️',
        color: 'bg-purple-50 border-purple-200',
      });
    }

    // Nutrition
    if (currentHealthData.junkFoodLevel > 2) {
      plan.push({
        category: 'Nutrition',
        priority: 'Medium',
        action: 'Improve dietary choices',
        details: 'Replace processed snacks with fruits, nuts, and vegetables.',
        icon: '🥗',
        color: 'bg-emerald-50 border-emerald-200',
      });
    }

    // Smoking
    if (currentHealthData.smoking) {
      plan.push({
        category: 'Smoking',
        priority: 'Critical',
        action: 'Quit smoking program',
        details: 'Consult a healthcare provider for smoking cessation resources.',
        icon: '🚭',
        color: 'bg-red-50 border-red-200',
      });
    }

    return plan;
  };

  const weeklySchedule = [
    {
      day: 'Monday',
      focus: 'Movement Monday',
      activities: ['30 min morning walk', '8 glasses of water', 'Bedtime by 10 PM'],
    },
    {
      day: 'Tuesday',
      focus: 'Nutrition Tuesday',
      activities: ['Healthy breakfast', 'Meal prep', 'Stress check-in'],
    },
    {
      day: 'Wednesday',
      focus: 'Wellness Wednesday',
      activities: ['Meditation session', 'Strength training', 'Sleep hygiene'],
    },
    {
      day: 'Thursday',
      focus: 'Thriving Thursday',
      activities: ['Active recovery', 'Hydration focus', 'Social connection'],
    },
    {
      day: 'Friday',
      focus: 'Fitness Friday',
      activities: ['Cardio workout', 'Healthy meal', 'Weekend planning'],
    },
    {
      day: 'Saturday',
      focus: 'Self-care Saturday',
      activities: ['Outdoor activity', 'Meal preparation', 'Relaxation'],
    },
    {
      day: 'Sunday',
      focus: 'Reset Sunday',
      activities: ['Week review', 'Goal setting', 'Rest and recovery'],
    },
  ];

  const actionPlan = generateActionPlan();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 pb-20">
      <div className="p-4 max-w-md mx-auto space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Action Plan</h1>
          <p className="text-gray-600">Personalized 7-day health improvement plan</p>
        </div>

        {/* Health Score Summary */}
        {latestRisk && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-sky-500 to-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Current Health Score</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold">{latestRisk.score}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {latestRisk.level} Risk
                    </Badge>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Priority Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <span>Priority Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionPlan.length > 0 ? actionPlan.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${item.color}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.action}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 ml-11">{item.details}</p>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 text-2xl">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Excellent Work!</h3>
                <p className="text-gray-600">You're maintaining great health habits. Keep it up!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 7-Day Schedule */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>7-Day Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklySchedule.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{day.day}</h4>
                  <Badge variant="outline" className="text-xs">
                    {day.focus}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {day.activities.map((activity, actIndex) => (
                    <p key={actIndex} className="text-sm text-gray-700 flex items-center">
                      <span className="text-green-500 mr-2">•</span>
                      {activity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Premium Features */}
        {profile?.subscription_plan !== 'premium' && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Unlock Premium Coaching</h3>
              <p className="text-purple-100 text-sm mb-4">
                Get AI-powered daily coaching, custom meal plans, and workout routines
              </p>
              <Button 
                onClick={() => navigate('/subscription')}
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold"
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/risk-scan')}
            className="w-full bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Update Health Assessment
          </Button>
          
          <Button 
            onClick={() => navigate('/chat')}
            variant="outline"
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 py-3 rounded-xl"
          >
            {profile?.subscription_plan === 'premium' ? 'Chat with AI Coach' : 'Chat with AI Coach (Premium)'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;
