
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Send, Star } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatSupport = () => {
  const { profile } = useAuth();
  const { riskHistory, currentHealthData } = useHealth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${profile?.name?.split(' ')[0] || 'there'}! I'm your AI Health Coach. I'm here to help you improve your health and wellness. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const predefinedQuestions = [
    "How can I improve my sleep quality?",
    "What's a healthy breakfast for me?",
    "How to reduce stress naturally?",
    "Best exercises for beginners?",
    "How to drink more water daily?",
  ];

  const generateAIResponse = (userMessage: string): string => {
    const latestRisk = riskHistory[riskHistory.length - 1];
    const responses: { [key: string]: string } = {
      'sleep': `Based on your current sleep pattern of ${currentHealthData.sleepHours} hours, I recommend establishing a consistent bedtime routine. Try going to bed and waking up at the same time daily, avoid screens 1 hour before bed, and create a cool, dark environment. ${currentHealthData.sleepHours < 7 ? 'You should aim for 7-9 hours of sleep.' : 'Your sleep duration looks good!'}`,
      
      'breakfast': `For a healthy breakfast, focus on protein, healthy fats, and complex carbs. Try: Greek yogurt with berries and nuts, oatmeal with banana and almond butter, or eggs with whole grain toast and avocado. ${currentHealthData.junkFoodLevel > 2 ? 'This will help reduce your processed food intake.' : 'Keep up the healthy eating!'}`,
      
      'stress': `Your stress level is currently ${currentHealthData.stressLevel}/10. To reduce stress naturally, try: 10 minutes of daily meditation, deep breathing exercises, regular physical activity, spending time in nature, or talking to friends and family. ${currentHealthData.stressLevel > 6 ? 'Consider these techniques as priority since your stress is elevated.' : 'Maintaining low stress is great for your health!'}`,
      
      'exercise': `With your current exercise frequency of ${currentHealthData.exerciseFrequency} days/week, ${currentHealthData.exerciseFrequency < 3 ? 'I recommend starting with 30-minute walks, bodyweight exercises like squats and push-ups, or yoga. Gradually increase to 4-5 times per week.' : 'you\'re doing well! Consider adding variety with strength training, cardio, and flexibility work.'}`,
      
      'water': `You're currently drinking ${currentHealthData.waterIntake}L per day. ${currentHealthData.waterIntake < 2.5 ? 'To increase intake: drink a glass upon waking, before each meal, keep a water bottle nearby, set hourly reminders, or add lemon for flavor.' : 'Your hydration looks good! Keep it up.'}`,
      
      'default': `Based on your current health score of ${latestRisk?.score || 'N/A'}, I recommend focusing on the areas that need improvement. ${latestRisk?.suggestions[0] || 'Keep maintaining your healthy lifestyle!'} Would you like specific advice on any particular area?`,
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('sleep')) return responses.sleep;
    if (lowerMessage.includes('breakfast') || lowerMessage.includes('meal') || lowerMessage.includes('eat')) return responses.breakfast;
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('relax')) return responses.stress;
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) return responses.exercise;
    if (lowerMessage.includes('water') || lowerMessage.includes('hydrat') || lowerMessage.includes('drink')) return responses.water;
    
    return responses.default;
  };

  const handleSendMessage = async () => {
    if (profile?.subscription_plan !== 'premium') {
      toast({
        title: "Premium Feature",
        description: "AI Health Coach is available for Premium users. Upgrade to chat with your personal AI coach.",
        variant: "destructive",
      });
      return;
    }

    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: generateAIResponse(inputMessage),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (profile?.subscription_plan !== 'premium') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 pb-20">
        <div className="p-4 max-w-md mx-auto space-y-6">
          <div className="pt-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Health Coach</h1>
            <p className="text-gray-600">Get personalized health advice 24/7</p>
          </div>

          {/* Premium Required */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
              <p className="text-purple-100 mb-6">
                Chat with your personal AI Health Coach for unlimited personalized advice, meal recommendations, and health guidance.
              </p>
              <Button 
                onClick={() => navigate('/subscription')}
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold"
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>

          {/* Preview Chat */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Preview Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-sky-100 text-sky-800 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Hello! I'm your AI Health Coach. How can I help you today?</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">How can I improve my sleep?</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-sky-100 text-sky-800 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Based on your health data, I recommend establishing a consistent bedtime routine...</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="text-gray-500 text-sm">Upgrade to Premium to unlock unlimited AI coaching</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 pb-20">
      <div className="p-4 max-w-md mx-auto space-y-6">
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Health Coach</h1>
              <p className="text-gray-600">Your personal health assistant</p>
            </div>
            <Badge className="bg-yellow-500 text-white">
              ⭐ Premium
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-sky-100 text-sky-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your health coach anything..."
                  className="flex-1 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {predefinedQuestions.map((question, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  variant="outline"
                  className="w-full justify-start text-left rounded-xl"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">What I Can Help With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-sky-50 rounded-lg">
                <div className="text-2xl mb-1">😴</div>
                <p className="text-xs text-gray-600">Sleep Advice</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🥗</div>
                <p className="text-xs text-gray-600">Nutrition</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">🏃‍♂️</div>
                <p className="text-xs text-gray-600">Exercise</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-1">🧘‍♀️</div>
                <p className="text-xs text-gray-600">Stress Relief</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatSupport;
