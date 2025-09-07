import { useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Activity, Heart, Download, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const RiskScan = () => {
  const { currentHealthData, updateHealthData, calculateRisk } = useHealth();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('RiskScan component rendered, result state:', result);

  const handleInputChange = (field: string, value: any) => {
    updateHealthData({ [field]: value });
  };

  const handleCalculateRisk = async () => {
    console.log('Starting risk calculation...');
    setIsCalculating(true);
    
    try {
      // Enhanced AI processing simulation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const riskResult = await calculateRisk();
      console.log('Risk calculation completed:', riskResult);
      
      // Enhanced risk analysis with more detailed insights
      const enhancedResult = {
        ...riskResult,
        aiAnalysis: {
          lifestyleFactors: analyzeLifestyleFactors(),
          healthMetrics: analyzeHealthMetrics(),
          riskPredictions: generateRiskPredictions(),
          personalizedPlan: generatePersonalizedPlan()
        }
      };
      
      console.log('Setting enhanced result:', enhancedResult);
      setResult(enhancedResult);
      
      toast({
        title: "AI Health Analysis Complete",
        description: `Comprehensive analysis generated with ${enhancedResult.score}/100 health score.`,
      });
    } catch (error) {
      console.error('Error calculating risk:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to complete health analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const analyzeLifestyleFactors = () => {
    const factors = [];
    
    if (currentHealthData.sleepHours < 7) {
      factors.push({ type: 'warning', text: 'Insufficient sleep may impact immune function and metabolism' });
    }
    if (currentHealthData.exerciseFrequency < 3) {
      factors.push({ type: 'alert', text: 'Low exercise frequency increases cardiovascular risk' });
    }
    if (currentHealthData.stressLevel > 7) {
      factors.push({ type: 'alert', text: 'High stress levels can contribute to various health issues' });
    }
    if (currentHealthData.waterIntake < 2) {
      factors.push({ type: 'warning', text: 'Dehydration can affect cognitive function and energy levels' });
    }
    if (currentHealthData.smoking) {
      factors.push({ type: 'critical', text: 'Smoking significantly increases risk of multiple diseases' });
    }
    
    return factors;
  };

  const analyzeHealthMetrics = () => {
    const bmi = currentHealthData.weight / Math.pow(currentHealthData.height / 100, 2);
    const metrics = [];
    
    if (bmi < 18.5) {
      metrics.push({ metric: 'BMI', value: bmi.toFixed(1), status: 'underweight', note: 'Consider nutritional consultation' });
    } else if (bmi > 25) {
      metrics.push({ metric: 'BMI', value: bmi.toFixed(1), status: 'overweight', note: 'Weight management may improve overall health' });
    } else {
      metrics.push({ metric: 'BMI', value: bmi.toFixed(1), status: 'normal', note: 'Healthy weight range' });
    }
    
    return metrics;
  };

  const generateRiskPredictions = () => {
    const predictions = [];
    
    // Cardiovascular risk
    let cvRisk = 'Low';
    if (currentHealthData.smoking || currentHealthData.stressLevel > 8 || currentHealthData.exerciseFrequency < 2) {
      cvRisk = 'Moderate';
    }
    if (currentHealthData.smoking && currentHealthData.stressLevel > 8) {
      cvRisk = 'High';
    }
    
    predictions.push({ condition: 'Cardiovascular Disease', risk: cvRisk, confidence: '85%' });
    
    // Diabetes risk
    let diabetesRisk = 'Low';
    if (currentHealthData.junkFoodLevel > 3 || currentHealthData.exerciseFrequency < 2) {
      diabetesRisk = 'Moderate';
    }
    predictions.push({ condition: 'Type 2 Diabetes', risk: diabetesRisk, confidence: '78%' });
    
    return predictions;
  };

  const generatePersonalizedPlan = () => {
    const plan = [];
    
    if (currentHealthData.sleepHours < 7) {
      plan.push({ priority: 'High', action: 'Improve sleep hygiene - aim for 7-9 hours nightly' });
    }
    if (currentHealthData.exerciseFrequency < 3) {
      plan.push({ priority: 'High', action: 'Increase physical activity to 150 minutes per week' });
    }
    if (currentHealthData.waterIntake < 2.5) {
      plan.push({ priority: 'Medium', action: 'Increase daily water intake to 2.5-3 liters' });
    }
    if (currentHealthData.stressLevel > 7) {
      plan.push({ priority: 'High', action: 'Practice stress management techniques (meditation, yoga)' });
    }
    
    return plan;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleGenerateReport = () => {
    console.log('Generate report clicked, result:', result);
    
    // Generate and download report
    const reportData = {
      date: new Date().toLocaleDateString(),
      healthScore: result.score,
      riskLevel: result.level,
      analysis: result.aiAnalysis,
      recommendations: result.suggestions
    };
    
    const reportText = `
HEALTHSCOPE AI - HEALTH ASSESSMENT REPORT
Generated: ${reportData.date}

HEALTH SCORE: ${reportData.healthScore}/100
RISK LEVEL: ${reportData.riskLevel}

LIFESTYLE FACTORS ANALYSIS:
${result.aiAnalysis?.lifestyleFactors?.map((factor: any, index: number) => 
  `${index + 1}. ${factor.text}`
).join('\n') || 'No specific concerns identified.'}

HEALTH RISK PREDICTIONS:
${result.aiAnalysis?.riskPredictions?.map((prediction: any, index: number) => 
  `${index + 1}. ${prediction.condition}: ${prediction.risk} Risk (${prediction.confidence} confidence)`
).join('\n') || 'Risk predictions not available.'}

PERSONALIZED ACTION PLAN:
${result.aiAnalysis?.personalizedPlan?.map((item: any, index: number) => 
  `${index + 1}. [${item.priority} Priority] ${item.action}`
).join('\n') || 'No specific actions recommended.'}

GENERAL RECOMMENDATIONS:
${result.suggestions?.map((suggestion: string, index: number) => 
  `${index + 1}. ${suggestion}`
).join('\n') || 'Continue maintaining your current health practices.'}

---
This report was generated by Healthscope AI based on your health assessment responses.
Please consult with healthcare professionals for medical advice.
    `.trim();

    // Create and download the report
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthscope-ai-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Your health assessment report has been downloaded.",
    });
  };

  // Show results section when result is available
  if (result) {
    console.log('Rendering results section with result:', result);
    return (
      <div className="page-layout bg-secondary">
        <div className="page-container space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">AI Health Analysis</h1>
              <p className="text-gray-600">Your comprehensive health assessment</p>
            </div>
          </div>

          {/* Main Result Card */}
          <Card className="shadow-lg w-full">
            <CardContent className="p-4 lg:p-6 text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-2xl lg:text-3xl font-bold">{result.score}</span>
              </div>
              
              <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">Health Score</h2>
              
              <Badge className={`text-base lg:text-lg px-3 lg:px-4 py-2 ${getRiskColor(result.level)}`}>
                {result.level} Risk Level
              </Badge>

              <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">🤖 AI Summary</h3>
                <p className="text-sm text-muted-foreground text-left">
                  Based on your lifestyle and health data, our AI has identified key areas for improvement. 
                  Your overall health profile shows {result.level.toLowerCase()} risk with specific attention needed 
                  in {result.aiAnalysis?.lifestyleFactors.length || 0} lifestyle factors.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Factors Analysis */}
          {result.aiAnalysis?.lifestyleFactors && result.aiAnalysis.lifestyleFactors.length > 0 && (
            <Card className="border-0 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-orange-600" />
                  Lifestyle Factor Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.aiAnalysis.lifestyleFactors.map((factor: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    factor.type === 'critical' ? 'bg-red-50 border border-red-200' :
                    factor.type === 'alert' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className={`text-sm ${
                      factor.type === 'critical' ? 'text-red-700' :
                      factor.type === 'alert' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {factor.type === 'critical' ? '🚨' : factor.type === 'alert' ? '⚠️' : 'ℹ️'} {factor.text}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Risk Predictions */}
          {result.aiAnalysis?.riskPredictions && (
            <Card className="border-0 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Health Risk Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.aiAnalysis.riskPredictions.map((prediction: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{prediction.condition}</p>
                      <p className="text-sm text-gray-600">Confidence: {prediction.confidence}</p>
                    </div>
                    <Badge className={getRiskColor(prediction.risk)}>
                      {prediction.risk} Risk
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Personalized Action Plan */}
          {result.aiAnalysis?.personalizedPlan && (
            <Card className="border-0 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI-Generated Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.aiAnalysis.personalizedPlan.map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Badge variant="outline" className={
                      item.priority === 'High' ? 'border-red-500 text-red-700' :
                      item.priority === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                      'border-green-500 text-green-700'
                    }>
                      {item.priority}
                    </Badge>
                    <p className="text-sm text-gray-700 flex-1">{item.action}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* PROMINENT Generate Report Button - Fixed Position */}
          <div className="sticky bottom-4 z-50">
            <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 shadow-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3">📋 Your Health Report is Ready!</h3>
                <p className="text-foreground/80 mb-3 lg:mb-4 text-sm lg:text-base">Download your comprehensive AI health analysis report</p>
                <Button 
                  onClick={handleGenerateReport}
                  variant="gradient"
                  className="w-full py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg shadow-lg"
                  size="lg"
                >
                  📄 Generate & Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <Button 
              onClick={() => setResult(null)}
              variant="outline"
              className="py-3 rounded-xl"
            >
              Retake Assessment
            </Button>

            <Button 
              onClick={() => navigate('/nutrition-scan')}
              variant="outline"
              className="py-3 rounded-xl"
            >
              Track Nutrition
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show assessment form when no result
  console.log('Rendering assessment form, result is null');
  return (
    <div className="page-layout bg-secondary">
      <div className="page-container space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">AI Health Risk Assessment</h1>
            <p className="text-gray-600">Comprehensive lifestyle and health analysis</p>
          </div>
        </div>

        {/* What You'll Get Preview Card */}
        <Card className="border-2 border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-sky-600 mr-3" />
              <h3 className="text-lg font-bold text-sky-800">What You'll Get After Assessment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">AI Health Score (0-100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Risk Level Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Personalized Action Plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Health Risk Predictions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Lifestyle Recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-purple-600" />
                <span className="text-gray-700 font-semibold">Downloadable Report</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-0 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Height (cm)</Label>
                <Input
                  type="number"
                  value={currentHealthData.height || ''}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                  placeholder="170"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  type="number"
                  value={currentHealthData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                  placeholder="70"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Age</Label>
              <Input
                type="number"
                value={currentHealthData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                placeholder="25"
                className="mt-1"
              />
            </div>

            {/* Family History */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Family Medical History</Label>
              <div className="space-y-2">
                {['Heart Disease', 'Diabetes', 'High Blood Pressure', 'Cancer'].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      id={condition}
                      checked={currentHealthData.familyHistory?.includes(condition) || false}
                      onCheckedChange={(checked) => {
                        const current = currentHealthData.familyHistory || [];
                        const updated = checked 
                          ? [...current, condition]
                          : current.filter(c => c !== condition);
                        handleInputChange('familyHistory', updated);
                      }}
                    />
                    <Label htmlFor={condition} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Sleep & Rest Analysis */}
        <Card className="border-0 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg">Sleep & Recovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Average sleep duration (hours/night)</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.sleepHours]}
                  onValueChange={(value) => handleInputChange('sleepHours', value[0])}
                  max={12}
                  min={3}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3h</span>
                  <span className="font-semibold text-sky-600">{currentHealthData.sleepHours}h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Sleep quality rating</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.sleepQuality || 7]}
                  onValueChange={(value) => handleInputChange('sleepQuality', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span className="font-semibold text-purple-600">Level {currentHealthData.sleepQuality || 7}</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">How often do you wake up feeling rested?</Label>
              <RadioGroup 
                value={currentHealthData.sleepRestfulness || 'sometimes'} 
                onValueChange={(value) => handleInputChange('sleepRestfulness', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never" className="text-sm">Never</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="rarely" />
                  <Label htmlFor="rarely" className="text-sm">Rarely</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sometimes" id="sometimes" />
                  <Label htmlFor="sometimes" className="text-sm">Sometimes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="often" id="often" />
                  <Label htmlFor="often" className="text-sm">Often</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="always" id="always" />
                  <Label htmlFor="always" className="text-sm">Always</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg">Nutrition & Hydration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Daily water intake (liters)</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.waterIntake]}
                  onValueChange={(value) => handleInputChange('waterIntake', value[0])}
                  max={5}
                  min={0.5}
                  step={0.25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5L</span>
                  <span className="font-semibold text-blue-600">{currentHealthData.waterIntake}L</span>
                  <span>5L</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Processed/junk food consumption</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.junkFoodLevel]}
                  onValueChange={(value) => handleInputChange('junkFoodLevel', value[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Never</span>
                  <span className="font-semibold text-orange-600">Level {currentHealthData.junkFoodLevel}</span>
                  <span>Daily</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Fruits & vegetables servings per day</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.fruitsVeggies || 3]}
                  onValueChange={(value) => handleInputChange('fruitsVeggies', value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 servings</span>
                  <span className="font-semibold text-green-600">{currentHealthData.fruitsVeggies || 3} servings</span>
                  <span>10+ servings</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg">Physical Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Exercise frequency (days per week)</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.exerciseFrequency]}
                  onValueChange={(value) => handleInputChange('exerciseFrequency', value[0])}
                  max={7}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 days</span>
                  <span className="font-semibold text-green-600">{currentHealthData.exerciseFrequency} days</span>
                  <span>7 days</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Exercise intensity level</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.exerciseIntensity || 5]}
                  onValueChange={(value) => handleInputChange('exerciseIntensity', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Light</span>
                  <span className="font-semibold text-red-600">Level {currentHealthData.exerciseIntensity || 5}</span>
                  <span>Intense</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Average daily steps</Label>
              <Input
                type="number"
                value={currentHealthData.steps}
                onChange={(e) => handleInputChange('steps', parseInt(e.target.value) || 0)}
                placeholder="8000"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg">Lifestyle & Mental Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Stress level (1-10)</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.stressLevel]}
                  onValueChange={(value) => handleInputChange('stressLevel', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span className="font-semibold text-red-600">Level {currentHealthData.stressLevel}</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Daily screen time (hours)</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.screenTime || 6]}
                  onValueChange={(value) => handleInputChange('screenTime', value[0])}
                  max={16}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1h</span>
                  <span className="font-semibold text-purple-600">{currentHealthData.screenTime || 6}h</span>
                  <span>16h</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Alcohol consumption (days per week)</Label>
              <div className="mt-2">
                <Slider
                  value={[currentHealthData.alcohol]}
                  onValueChange={(value) => handleInputChange('alcohol', value[0])}
                  max={7}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 days</span>
                  <span className="font-semibold text-purple-600">{currentHealthData.alcohol} days</span>
                  <span>7 days</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Do you smoke tobacco?</Label>
              <Switch
                checked={currentHealthData.smoking}
                onCheckedChange={(checked) => handleInputChange('smoking', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Regular medical checkups?</Label>
              <Switch
                checked={currentHealthData.regularCheckups || false}
                onCheckedChange={(checked) => handleInputChange('regularCheckups', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Calculate Button with clear instruction */}
        <div className="sticky bottom-4 z-50">
          <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-accent/10 shadow-lg">
            <CardContent className="p-4 lg:p-6 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">Ready to Get Your Health Analysis?</h3>
              <p className="text-muted-foreground mb-4 text-sm">Complete all sections above, then click below to generate your personalized health report with AI insights and recommendations.</p>
              <Button
                onClick={handleCalculateRisk}
                disabled={isCalculating}
                variant="gradient"
                className="w-full py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg shadow-lg"
              >
                {isCalculating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    <span>🤖 AI Analyzing Your Health...</span>
                  </div>
                ) : (
                  '🤖 Generate AI Health Analysis & Report'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskScan;
