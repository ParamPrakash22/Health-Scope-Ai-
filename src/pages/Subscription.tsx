
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, Star } from 'lucide-react';

const Subscription = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFreePlan = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await updateProfile({
        subscription_plan: 'free',
        subscription_expires_at: undefined
      });
      
      toast({
        title: "Plan Updated",
        description: "You're now on the free plan.",
      });
      
      // Quick navigation back after update
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePremiumPlan = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      await updateProfile({
        subscription_plan: 'premium',
        subscription_expires_at: expiresAt.toISOString()
      });
      
      toast({
        title: "Welcome to Premium!",
        description: "You now have access to all premium features.",
      });
      
      // Quick navigation back after update
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = profile?.subscription_plan === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 pb-20">
      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription</h1>
          <p className="text-gray-600">Manage your subscription plan</p>
        </div>

        {/* Current Plan */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {isPremium ? (
              <>
                <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-2xl font-bold mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Premium</h2>
                <p className="text-green-600 font-semibold mt-2">
                  Active until {new Date(profile.subscription_expires_at || '').toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Free</h2>
                <p className="text-gray-600 mt-2">Limited features</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Plan Options */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Plan Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Free Plan */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <p className="text-gray-600 text-sm">
                Basic health tracking and limited features
              </p>
              <Button 
                onClick={handleFreePlan} 
                disabled={isLoading || !isPremium}
                className="mt-3 w-full"
                variant={isPremium ? "outline" : "default"}
              >
                {isLoading ? 'Updating...' : (isPremium ? 'Downgrade' : 'Current Plan')}
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
              <h3 className="text-lg font-semibold">Premium</h3>
              <p className="text-purple-100 text-sm">
                Unlimited scans, AI coaching, and family monitoring
              </p>
              <Button 
                onClick={handlePremiumPlan} 
                disabled={isLoading || isPremium}
                className="mt-3 w-full bg-white text-purple-600 hover:bg-gray-100"
              >
                {isLoading ? 'Upgrading...' : 'Upgrade to Premium'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-600 text-sm">
              Your subscription helps us maintain and improve our services.
            </p>
            <p className="text-gray-600 text-sm">
              Contact our support team for any questions regarding your subscription.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
