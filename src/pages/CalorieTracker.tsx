
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Target, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalData {
  type: 'gain' | 'lose' | 'maintain';
  targetWeight: number;
  currentWeight: number;
  timeframe: number; // days
  dailyCalorieTarget: number;
  createdAt: string;
}

const CalorieTracker = () => {
  const { foodScans, addFoodScan, getDailyCalories } = useHealth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal_type: 'breakfast'
  });
  
  const [goal, setGoal] = useState<GoalData | null>(() => {
    const saved = localStorage.getItem('weightGoal');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [goalForm, setGoalForm] = useState({
    type: 'lose' as 'gain' | 'lose' | 'maintain',
    targetWeight: '',
    currentWeight: '',
    timeframe: '60', // days
  });

  const dailyCalories = getDailyCalories();
  const dailyTarget = goal?.dailyCalorieTarget || 2000;
  const remainingCalories = dailyTarget - dailyCalories;
  const progressPercentage = Math.min((dailyCalories / dailyTarget) * 100, 100);

  const todaysFoods = foodScans.filter(scan => {
    const today = new Date().toISOString().split('T')[0];
    return scan.date === today;
  });

  const mealTypes = {
    breakfast: todaysFoods.filter(f => f.meal_type === 'breakfast'),
    lunch: todaysFoods.filter(f => f.meal_type === 'lunch'),
    dinner: todaysFoods.filter(f => f.meal_type === 'dinner'),
    snacks: todaysFoods.filter(f => f.meal_type === 'snacks'),
  };

  const getMealCalories = (mealType: string) => {
    return mealTypes[mealType as keyof typeof mealTypes]?.reduce((sum, food) => sum + Number(food.calories), 0) || 0;
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      toast({
        title: "Missing Information",
        description: "Please enter meal name and calories.",
        variant: "destructive",
      });
      return;
    }

    const foodData = {
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      scan_type: 'manual' as const,
      date: new Date().toISOString().split('T')[0],
      meal_type: newMeal.meal_type
    };

    addFoodScan(foodData);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', meal_type: 'breakfast' });
    setShowAddMeal(false);
    
    toast({
      title: "Meal Added!",
      description: `${newMeal.name} has been added to your ${newMeal.meal_type}.`,
    });
  };

  const calculateGoalCalories = (type: string, current: number, target: number, days: number) => {
    const weightDiff = target - current;
    const dailyWeightChange = weightDiff / days;
    
    // Rough calculation: 1 kg = 7700 calories
    const dailyCalorieAdjustment = dailyWeightChange * 7700;
    const baseCalories = 2000; // Basic metabolic rate estimation
    
    return Math.round(baseCalories + dailyCalorieAdjustment);
  };

  const handleSaveGoal = () => {
    if (!goalForm.currentWeight || !goalForm.targetWeight) {
      toast({
        title: "Missing Information",
        description: "Please enter current and target weight.",
        variant: "destructive",
      });
      return;
    }

    const current = Number(goalForm.currentWeight);
    const target = Number(goalForm.targetWeight);
    const days = Number(goalForm.timeframe);
    
    const dailyCalorieTarget = calculateGoalCalories(goalForm.type, current, target, days);
    
    const newGoal: GoalData = {
      type: goalForm.type,
      targetWeight: target,
      currentWeight: current,
      timeframe: days,
      dailyCalorieTarget,
      createdAt: new Date().toISOString(),
    };
    
    setGoal(newGoal);
    localStorage.setItem('weightGoal', JSON.stringify(newGoal));
    setShowSetGoal(false);
    
    toast({
      title: "Goal Set!",
      description: `Your ${goalForm.type} goal has been saved. Daily target: ${dailyCalorieTarget} calories.`,
    });
  };

  const getGoalProgress = () => {
    if (!goal) return null;
    
    const daysElapsed = Math.floor((Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = goal.timeframe;
    const progressDays = Math.min(daysElapsed, totalDays);
    
    return {
      daysElapsed: progressDays,
      totalDays,
      percentComplete: (progressDays / totalDays) * 100
    };
  };

  const goalProgress = getGoalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-full mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="pt-4 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calorie Tracker</h1>
            <p className="text-gray-600">Track your daily nutrition and goals</p>
          </div>
        </div>

        {/* Daily Progress */}
        <Card className="border-0 shadow-lg w-full">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Today's Progress</h2>
                <Badge variant={remainingCalories > 0 ? "secondary" : "destructive"}>
                  {remainingCalories > 0 ? `${remainingCalories} left` : `${Math.abs(remainingCalories)} over`}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Consumed: {dailyCalories} cal</span>
                  <span>Target: {dailyTarget} cal</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{dailyCalories}</p>
                  <p className="text-sm text-gray-600">Consumed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dailyTarget}</p>
                  <p className="text-sm text-gray-600">Target</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Tracking */}
        <Card className="border-0 shadow-lg w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Weight Goal
              </span>
              <Button
                onClick={() => setShowSetGoal(true)}
                size="sm"
                variant="outline"
              >
                {goal ? 'Update Goal' : 'Set Goal'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goal ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {goal.type === 'lose' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : goal.type === 'gain' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <Target className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="font-medium capitalize">{goal.type} Weight</span>
                  </div>
                  <Badge variant="secondary">
                    {goal.currentWeight}kg → {goal.targetWeight}kg
                  </Badge>
                </div>
                
                {goalProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Day {goalProgress.daysElapsed} of {goalProgress.totalDays}</span>
                      <span>{Math.round(goalProgress.percentComplete)}% complete</span>
                    </div>
                    <Progress value={goalProgress.percentComplete} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {goal.timeframe} days
                  </div>
                  <div>
                    Target: {goal.dailyCalorieTarget} cal/day
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">Set a weight goal to track your progress</p>
                <Button onClick={() => setShowSetGoal(true)}>
                  Set Your Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meals */}
        <div className="space-y-4">
          {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
            <Card key={mealType} className="border-0 shadow-sm w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{mealType}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {getMealCalories(mealType)} cal
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewMeal({ ...newMeal, meal_type: mealType });
                        setShowAddMeal(true);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {mealTypes[mealType as keyof typeof mealTypes].length > 0 ? (
                  <div className="space-y-2">
                    {mealTypes[mealType as keyof typeof mealTypes].map((food, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{food.name}</p>
                          <p className="text-xs text-gray-600">
                            {food.scan_type === 'barcode' ? 'Scanned' : 
                             food.scan_type === 'plate' ? 'Photo' : 'Manual'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{food.calories} cal</p>
                          <p className="text-xs text-gray-600">
                            P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items added yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg w-full">
          <CardContent className="p-4">
            <Button
              onClick={() => navigate('/meal-scanner')}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Scan Food
            </Button>
          </CardContent>
        </Card>

        {/* Add Meal Dialog */}
        <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Meal Type</Label>
                <Select value={newMeal.meal_type} onValueChange={(value) => setNewMeal({...newMeal, meal_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Food Name</Label>
                <Input
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                    placeholder="350"
                  />
                </div>
                <div>
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    placeholder="25"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Carbs (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    placeholder="15"
                  />
                </div>
                <div>
                  <Label>Fat (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                    placeholder="12"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowAddMeal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMeal}
                  className="flex-1"
                >
                  Add Meal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Set Goal Dialog */}
        <Dialog open={showSetGoal} onOpenChange={setShowSetGoal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Weight Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Goal Type</Label>
                <Select value={goalForm.type} onValueChange={(value: 'gain' | 'lose' | 'maintain') => setGoalForm({...goalForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Weight (kg)</Label>
                  <Input
                    type="number"
                    value={goalForm.currentWeight}
                    onChange={(e) => setGoalForm({...goalForm, currentWeight: e.target.value})}
                    placeholder="70"
                  />
                </div>
                <div>
                  <Label>Target Weight (kg)</Label>
                  <Input
                    type="number"
                    value={goalForm.targetWeight}
                    onChange={(e) => setGoalForm({...goalForm, targetWeight: e.target.value})}
                    placeholder="65"
                  />
                </div>
              </div>
              <div>
                <Label>Timeframe</Label>
                <Select value={goalForm.timeframe} onValueChange={(value) => setGoalForm({...goalForm, timeframe: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">1 Month (30 days)</SelectItem>
                    <SelectItem value="60">2 Months (60 days)</SelectItem>
                    <SelectItem value="90">3 Months (90 days)</SelectItem>
                    <SelectItem value="180">6 Months (180 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowSetGoal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveGoal}
                  className="flex-1"
                >
                  Save Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalorieTracker;
