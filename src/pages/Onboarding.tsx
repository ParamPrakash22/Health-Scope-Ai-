import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  city: string;
}

interface HealthInfo {
  sleepHours: number;
  waterIntake: number;
  exerciseFrequency: number;
  stressLevel: number;
  healthConditions: string[];
}

const Onboarding = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    age: 18,
    gender: 'male',
    weight: 70,
    height: 175,
    city: '',
  });
  const [healthInfo, setHealthInfo] = useState<HealthInfo>({
    sleepHours: 7,
    waterIntake: 2,
    exerciseFrequency: 3,
    stressLevel: 5,
    healthConditions: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile } = useAuth();
  const { updateHealthData } = useHealth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleHealthInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHealthInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateProfile({
        name: personalInfo.name,
        age: personalInfo.age,
        gender: personalInfo.gender as 'male' | 'female' | 'other',
        weight: personalInfo.weight,
        height: personalInfo.height,
        city: personalInfo.city,
        health_conditions: healthInfo.healthConditions,
        subscription_plan: 'free'
      });

      // Initialize health data
      await updateHealthData({
        sleepHours: healthInfo.sleepHours,
        waterIntake: healthInfo.waterIntake,
        exerciseFrequency: healthInfo.exerciseFrequency,
        stressLevel: healthInfo.stressLevel,
      });

      toast({
        title: "Profile created!",
        description: "Welcome to HealthScope AI! Let's start your health journey.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sky-500 to-green-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-xl font-bold">HS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Tell us a bit about yourself to get started</p>
        </div>

        {/* Onboarding Form */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  value={personalInfo.age}
                  onChange={handlePersonalInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select gender" defaultValue={personalInfo.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  name="weight"
                  placeholder="Enter your weight"
                  value={personalInfo.weight}
                  onChange={handlePersonalInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  name="height"
                  placeholder="Enter your height"
                  value={personalInfo.height}
                  onChange={handlePersonalInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={personalInfo.city}
                  onChange={handlePersonalInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-center text-lg">Health Information</CardTitle>
              </CardHeader>

              <div className="space-y-2">
                <Label htmlFor="sleepHours">Sleep Hours</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  name="sleepHours"
                  placeholder="Enter your sleep hours"
                  value={healthInfo.sleepHours}
                  onChange={handleHealthInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterIntake">Water Intake (liters)</Label>
                <Input
                  id="waterIntake"
                  type="number"
                  name="waterIntake"
                  placeholder="Enter your water intake"
                  value={healthInfo.waterIntake}
                  onChange={handleHealthInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">Exercise Frequency (times per week)</Label>
                <Input
                  id="exerciseFrequency"
                  type="number"
                  name="exerciseFrequency"
                  placeholder="Enter your exercise frequency"
                  value={healthInfo.exerciseFrequency}
                  onChange={handleHealthInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                <Input
                  id="stressLevel"
                  type="number"
                  name="stressLevel"
                  placeholder="Enter your stress level"
                  value={healthInfo.stressLevel}
                  onChange={handleHealthInfoChange}
                  required
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 text-white py-3 rounded-xl font-semibold"
              >
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
