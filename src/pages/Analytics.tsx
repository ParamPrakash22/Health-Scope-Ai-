
import React from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Activity, Heart, Droplets, Moon, Zap, Brain } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const { riskHistory, healthHistory, foodScans } = useHealth();
  const navigate = useNavigate();

  // Calculate analytics data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const healthTrend = riskHistory.length >= 2 
    ? riskHistory[riskHistory.length - 1].score - riskHistory[riskHistory.length - 2].score
    : 0;

  const avgSleep = healthHistory.length > 0 
    ? healthHistory.reduce((sum, h) => sum + h.sleepHours, 0) / healthHistory.length
    : 0;

  const avgWater = healthHistory.length > 0 
    ? healthHistory.reduce((sum, h) => sum + h.waterIntake, 0) / healthHistory.length
    : 0;

  const avgStress = healthHistory.length > 0 
    ? healthHistory.reduce((sum, h) => sum + h.stressLevel, 0) / healthHistory.length
    : 0;

  const avgExercise = healthHistory.length > 0 
    ? healthHistory.reduce((sum, h) => sum + h.exerciseFrequency, 0) / healthHistory.length
    : 0;

  const weeklyCalories = last30Days.slice(-7).map(date => ({
    date,
    calories: foodScans
      .filter(scan => scan.date === date)
      .reduce((sum, scan) => sum + scan.calories, 0)
  }));

  const maxCalories = Math.max(...weeklyCalories.map(d => d.calories), 1);

  const getMetricStatus = (value: number, good: number, excellent: number) => {
    if (value >= excellent) return { status: 'excellent', color: 'bg-green-500', textColor: 'text-green-400' };
    if (value >= good) return { status: 'good', color: 'bg-blue-500', textColor: 'text-blue-400' };
    return { status: 'needs-improvement', color: 'bg-orange-500', textColor: 'text-orange-400' };
  };

  const sleepStatus = getMetricStatus(avgSleep, 7, 8);
  const waterStatus = getMetricStatus(avgWater, 2, 2.5);
  const exerciseStatus = getMetricStatus(avgExercise, 3, 5);
  const stressStatus = getMetricStatus(10 - avgStress, 5, 7); // Inverted because lower stress is better

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-white">Health Analytics</h1>
          <p className="text-gray-400">Detailed insights into your wellness journey</p>
        </div>

        {/* Health Score Trend */}
        <Card className="bg-gray-900 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Health Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-white">
                  {riskHistory.length > 0 ? riskHistory[riskHistory.length - 1].score : 0}
                </p>
                <p className="text-sm text-gray-400">Current Score</p>
              </div>
              <div className="flex items-center gap-2">
                {healthTrend > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm font-medium ${healthTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {healthTrend > 0 ? '+' : ''}{healthTrend}
                </span>
              </div>
            </div>

            {/* Simple Score History Visualization */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Recent History</p>
              <div className="flex items-end gap-1 h-16">
                {riskHistory.slice(-14).map((risk, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                    style={{ height: `${(risk.score / 100) * 100}%` }}
                    title={`${risk.score} on ${new Date(risk.date).toLocaleDateString()}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Moon className={`w-8 h-8 ${sleepStatus.textColor}`} />
              </div>
              <p className="text-2xl font-bold text-white">{avgSleep.toFixed(1)}h</p>
              <p className="text-xs text-gray-400">Avg Sleep</p>
              <div className={`w-full h-1 ${sleepStatus.color} rounded-full mt-2`} />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Droplets className={`w-8 h-8 ${waterStatus.textColor}`} />
              </div>
              <p className="text-2xl font-bold text-white">{avgWater.toFixed(1)}L</p>
              <p className="text-xs text-gray-400">Avg Water</p>
              <div className={`w-full h-1 ${waterStatus.color} rounded-full mt-2`} />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-8 h-8 ${exerciseStatus.textColor}`} />
              </div>
              <p className="text-2xl font-bold text-white">{avgExercise.toFixed(1)}</p>
              <p className="text-xs text-gray-400">Exercise Days/Week</p>
              <div className={`w-full h-1 ${exerciseStatus.color} rounded-full mt-2`} />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className={`w-8 h-8 ${stressStatus.textColor}`} />
              </div>
              <p className="text-2xl font-bold text-white">{avgStress.toFixed(1)}/10</p>
              <p className="text-xs text-gray-400">Avg Stress</p>
              <div className={`w-full h-1 ${stressStatus.color} rounded-full mt-2`} />
            </CardContent>
          </Card>
        </div>

        {/* Weekly Nutrition */}
        <Card className="bg-gray-900 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Weekly Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyCalories.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 w-16">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max((day.calories / maxCalories) * 100, 5)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white w-16 text-right">
                    {day.calories}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Weekly Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {avgSleep < 7 && (
              <div className="p-3 bg-orange-900/50 rounded-lg border border-orange-700">
                <p className="text-sm text-orange-200">
                  💤 Your sleep average is {avgSleep.toFixed(1)} hours. Aim for 7-9 hours for optimal recovery.
                </p>
              </div>
            )}
            
            {avgWater < 2 && (
              <div className="p-3 bg-blue-900/50 rounded-lg border border-blue-700">
                <p className="text-sm text-blue-200">
                  💧 Increase water intake to at least 2L daily. You're currently at {avgWater.toFixed(1)}L average.
                </p>
              </div>
            )}

            {avgExercise < 3 && (
              <div className="p-3 bg-green-900/50 rounded-lg border border-green-700">
                <p className="text-sm text-green-200">
                  🏃‍♂️ Try to exercise {avgExercise.toFixed(1)} → 3+ days per week for better health outcomes.
                </p>
              </div>
            )}

            {healthTrend > 5 && (
              <div className="p-3 bg-emerald-900/50 rounded-lg border border-emerald-700">
                <p className="text-sm text-emerald-200">
                  🎉 Great progress! Your health score improved by {healthTrend} points recently.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
          >
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate('/risk-scan')}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-3 rounded-xl"
          >
            Take New Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
