
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Camera, Scan, Upload, Utensils } from 'lucide-react';
import { CameraCapture } from '@/components/CameraCapture';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MealScannerFullscreen = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodData, setFoodData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeFood = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFoodData = {
        name: 'Grilled Chicken Salad',
        calories: 285,
        protein: 32,
        carbs: 12,
        fat: 14,
        fiber: 4,
        sodium: 320,
        sugar: 8
      };

      // Save to database
      const { data, error } = await supabase
        .from('food_scans')
        .insert({
          name: mockFoodData.name,
          calories: mockFoodData.calories,
          protein: mockFoodData.protein,
          carbs: mockFoodData.carbs,
          fat: mockFoodData.fat,
          fiber: mockFoodData.fiber,
          sodium: mockFoodData.sodium,
          sugar: mockFoodData.sugar,
          scan_type: 'plate',
          user_id: profile?.id,
          image_url: imageDataUrl
        })
        .select()
        .single();

      if (error) throw error;

      setFoodData(mockFoodData);
      toast({
        title: "Food analyzed successfully!",
        description: `${mockFoodData.name} - ${mockFoodData.calories} calories`,
      });
    } catch (error) {
      console.error('Food analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the food. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        analyzeFood(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeBarcode = async (barcode: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate barcode lookup - replace with actual Nutritionix API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProductData = {
        name: 'Organic Whole Milk',
        calories: 150,
        protein: 8,
        carbs: 12,
        fat: 8,
        fiber: 0,
        sodium: 105,
        sugar: 12
      };

      // Save to database
      const { data, error } = await supabase
        .from('food_scans')
        .insert({
          name: mockProductData.name,
          calories: mockProductData.calories,
          protein: mockProductData.protein,
          carbs: mockProductData.carbs,
          fat: mockProductData.fat,
          fiber: mockProductData.fiber,
          sodium: mockProductData.sodium,
          sugar: mockProductData.sugar,
          scan_type: 'barcode',
          barcode: barcode,
          user_id: profile?.id
        })
        .select()
        .single();

      if (error) throw error;

      setFoodData(mockProductData);
      toast({
        title: "Product scanned successfully!",
        description: `${mockProductData.name} - ${mockProductData.calories} calories`,
      });
    } catch (error) {
      console.error('Barcode analysis error:', error);
      toast({
        title: "Scan failed",
        description: "Unable to find product information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 w-full">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meal Scanner</h1>
            <p className="text-gray-600">Scan food to track nutrition</p>
          </div>
        </div>

        {/* Scanning Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Scan Your Plate</CardTitle>
              <p className="text-gray-600">Take a photo of your meal</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowCamera(true)}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isAnalyzing}
              >
                <Camera className="w-5 h-5 mr-2" />
                Open Camera
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Upload Image</CardTitle>
              <p className="text-gray-600">Choose photo from gallery</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={isAnalyzing}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Scan Barcode</CardTitle>
              <p className="text-gray-600">Scan packaged food barcodes</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowBarcodeScanner(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isAnalyzing}
              >
                <Scan className="w-5 h-5 mr-2" />
                Scan Barcode
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {isAnalyzing && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Analyzing...</h3>
              <p className="text-gray-600">Please wait while we process your scan</p>
            </CardContent>
          </Card>
        )}

        {foodData && !isAnalyzing && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Utensils className="w-6 h-6 text-green-500" />
                <span>{foodData.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{foodData.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{foodData.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{foodData.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{foodData.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Fiber: {foodData.fiber}g</Badge>
                <Badge variant="outline">Sodium: {foodData.sodium}mg</Badge>
                <Badge variant="outline">Sugar: {foodData.sugar}g</Badge>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1 bg-green-500 hover:bg-green-600">
                  Add to Today's Log
                </Button>
                <Button variant="outline" className="flex-1">
                  Save for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={analyzeFood}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={analyzeBarcode}
      />
    </div>
  );
};

export default MealScannerFullscreen;
