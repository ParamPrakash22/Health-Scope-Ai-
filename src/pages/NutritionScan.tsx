
import { useState } from 'react';
import { Camera, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  image_url?: string;
  barcode?: string;
  scan_type: 'photo' | 'barcode';
  date: string;
}

const NutritionScan = () => {
  const [scannedItems, setScannedItems] = useState<NutritionData[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScanComplete = (data: NutritionData) => {
    setScannedItems(prev => [...prev, data]);
    
    toast({
      title: "Item Added!",
      description: `${data.name} has been added to your nutrition log.`,
    });
  };

  const getTotalNutrition = () => {
    return scannedItems.reduce((total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat,
      fiber: total.fiber + item.fiber,
      sugar: total.sugar + item.sugar,
      sodium: total.sodium + item.sodium,
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    });
  };

  const totalNutrition = getTotalNutrition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50">
      <div className="w-full max-w-full mx-auto space-y-6 p-4">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Scanner</h1>
          <p className="text-gray-600">Scan your meals to track nutrition</p>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg w-full">
          <CardContent className="p-4">
            <Button
              onClick={() => navigate('/meal-scanner')}
              className="w-full bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 text-white py-4 rounded-xl font-semibold text-lg"
            >
              <Camera className="h-6 w-6 mr-3" />
              Scan New Meal
            </Button>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        {scannedItems.length > 0 && (
          <Card className="border-0 shadow-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Today's Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{totalNutrition.calories}</p>
                  <p className="text-sm text-gray-600">Calories</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{totalNutrition.protein}g</p>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{totalNutrition.carbs}g</p>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{totalNutrition.fat}g</p>
                  <p className="text-sm text-gray-600">Fat</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-700">{totalNutrition.fiber}g</p>
                  <p className="text-gray-500">Fiber</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">{totalNutrition.sugar}g</p>
                  <p className="text-gray-500">Sugar</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">{totalNutrition.sodium}mg</p>
                  <p className="text-gray-500">Sodium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanned Items */}
        {scannedItems.length > 0 && (
          <Card className="border-0 shadow-lg w-full">
            <CardHeader>
              <CardTitle className="text-lg">Today's Meals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scannedItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.calories} cal • {item.protein}g protein
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.scan_type === 'photo' ? 'Photo scan' : 'Barcode scan'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {scannedItems.length === 0 && (
          <Card className="border-0 shadow-lg w-full">
            <CardContent className="p-8 text-center">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No meals scanned yet</h3>
              <p className="text-gray-600 mb-6">
                Start by scanning your first meal to track your daily nutrition
              </p>
              <Button
                onClick={() => navigate('/meal-scanner')}
                className="bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Meal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NutritionScan;
