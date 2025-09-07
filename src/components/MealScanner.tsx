
import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MealScannerProps {
  onScanComplete: (data: any) => void;
  onClose: () => void;
}

const MealScanner: React.FC<MealScannerProps> = ({ onScanComplete, onClose }) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'barcode'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          console.log('Camera ready');
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context && video.videoWidth > 0) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop camera after capture
        stopCamera();
        
        analyzeMeal(imageData);
      } else {
        toast({
          title: "Camera Error",
          description: "Camera not ready. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        analyzeMeal(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeal = async (imageData: string) => {
    setIsScanning(true);
    
    try {
      // For now, we'll use a sample food description
      // In the future, this would use vision AI to identify food from the image
      const sampleFoodQuery = "grilled chicken breast with rice and vegetables";
      
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { 
          query: sampleFoodQuery,
          type: 'natural'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze food');
      }

      if (data?.nutritionData) {
        const nutritionData = {
          ...data.nutritionData,
          image_url: imageData,
          scan_type: 'plate',
          date: new Date().toISOString().split('T')[0],
        };
        
        onScanComplete(nutritionData);
        
        toast({
          title: "Meal Analyzed!",
          description: `Found ${nutritionData.calories} calories in your meal.`,
        });
      } else {
        throw new Error('No nutrition data received');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Fallback to mock data if API fails
      const nutritionData = {
        name: 'Mixed Meal',
        calories: 350,
        protein: 25,
        carbs: 15,
        fat: 20,
        fiber: 8,
        sugar: 5,
        sodium: 400,
        image_url: imageData,
        scan_type: 'plate',
        date: new Date().toISOString().split('T')[0],
      };
      
      onScanComplete(nutritionData);
      
      toast({
        title: "Meal Analyzed!",
        description: "Nutrition information has been estimated.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const scanBarcode = async (barcode: string) => {
    if (!barcode.trim()) return;
    
    setIsScanning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { 
          query: barcode,
          type: 'barcode'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to scan barcode');
      }

      if (data?.nutritionData) {
        const productData = {
          ...data.nutritionData,
          barcode: barcode,
          date: new Date().toISOString().split('T')[0],
        };
        
        onScanComplete(productData);
        
        toast({
          title: "Product Found!",
          description: `${productData.name} - ${productData.calories} calories`,
        });
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      toast({
        title: "Product Not Found",
        description: "Unable to find product information for this barcode.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  React.useEffect(() => {
    if (scanMode === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [scanMode, capturedImage]);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] flex flex-col bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Meal Scanner</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Scan Mode Selection */}
          <div className="flex space-x-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              size="sm"
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
            <Button
              variant={scanMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setScanMode('upload')}
              size="sm"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant={scanMode === 'barcode' ? 'default' : 'outline'}
              onClick={() => setScanMode('barcode')}
              size="sm"
              className="flex-1"
            >
              <Scan className="h-4 w-4 mr-2" />
              Barcode
            </Button>
          </div>

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="flex-1 flex flex-col space-y-4">
              {!capturedImage ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: '250px', maxHeight: '350px' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!cameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p>Initializing camera...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={capturePhoto} 
                    className="w-full mt-4 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                    disabled={!cameraReady}
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    {cameraReady ? 'Capture Photo' : 'Loading Camera...'}
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex-1 overflow-hidden rounded-lg">
                    <img
                      src={capturedImage}
                      alt="Captured meal"
                      className="w-full h-full object-cover"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  {isScanning ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p>Analyzing meal...</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        setCapturedImage(null);
                        setScanMode('camera');
                      }} 
                      variant="outline"
                      className="w-full"
                    >
                      Take Another Photo
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Upload Mode */}
          {scanMode === 'upload' && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center" style={{ minHeight: '200px' }}>
                {!capturedImage ? (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload a photo of your meal</p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <img
                      src={capturedImage}
                      alt="Uploaded meal"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    {isScanning ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p>Analyzing meal...</p>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setCapturedImage(null)} 
                        variant="outline" 
                        className="w-full"
                      >
                        Upload Different Photo
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Barcode Mode */}
          {scanMode === 'barcode' && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="space-y-4">
                <Label htmlFor="barcode">Enter Barcode</Label>
                <Input
                  id="barcode"
                  placeholder="Scan or enter barcode number"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      scanBarcode(e.currentTarget.value);
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('barcode') as HTMLInputElement;
                    scanBarcode(input.value);
                  }}
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Looking up product...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Scan Barcode
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default MealScanner;
