
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

const Profile = () => {
  const { profile, updateProfile, logout } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age || 0);
      setWeight(profile.weight || 0);
      setHeight(profile.height || 0);
      setCity(profile.city || '');
    }
  }, [profile]);

  const calculateBMI = () => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return 'N/A';
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name,
        age,
        weight,
        height,
        city,
      });
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/welcome');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const isPremium = profile.subscription_plan === 'premium';

  return (
    <div className="page-layout bg-secondary">
      <div className="page-container space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your health profile and preferences</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Profile Picture */}
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
            <Badge 
              variant={isPremium ? "default" : "secondary"}
              className="mt-2"
            >
              {isPremium ? '⭐ Premium' : 'Free Plan'}
            </Badge>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="Age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="Weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  placeholder="Height"
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={isLoading} className="w-full">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Health Stats */}
        {weight > 0 && height > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Health Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{calculateBMI()}</p>
                  <p className="text-sm text-blue-700">BMI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Conditions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Health Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.health_conditions && profile.health_conditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No health conditions recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Premium Upgrade */}
        {!isPremium && (
          <Card className="shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-purple-100 text-sm mb-4">
                Get unlimited features and personalized health insights
              </p>
              <Button 
                onClick={() => navigate('/subscription')}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
