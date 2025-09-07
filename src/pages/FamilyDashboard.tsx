import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, Star, ArrowLeft, Upload, FileText, Edit, Trash2, ChevronRight, User, Weight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender?: string;
  relationship: string;
  weight?: number;
  height?: number;
  lifestyle?: string;
  existing_conditions?: string[];
  avatar_url?: string;
  created_at: string;
}

interface HealthReport {
  id: string;
  report_name: string;
  report_type: string;
  good_indicators?: string[];
  focus_areas?: string[];
  ai_suggestions?: string[];
  created_at: string;
  ai_analysis?: any;
  file_url?: string;
}

const FamilyDashboard = () => {
  const { profile } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [memberReports, setMemberReports] = useState<HealthReport[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    gender: '',
    relationship: '',
    weight: '',
    height: '',
    lifestyle: '',
    existing_conditions: [] as string[],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isPremium = profile?.subscription_plan === 'premium';

  // Load family members
  useEffect(() => {
    if (isPremium) {
      loadFamilyMembers();
    }
  }, [isPremium]);

  const loadFamilyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Error",
        description: "Failed to load family members.",
        variant: "destructive",
      });
    }
  };

  const loadMemberReports = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('family_health_reports')
        .select('*')
        .eq('family_member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemberReports(data || []);
    } catch (error) {
      console.error('Error loading member reports:', error);
      toast({
        title: "Error",
        description: "Failed to load health reports.",
        variant: "destructive",
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!newMember.name || !newMember.age || !newMember.relationship) {
        toast({
          title: "Please fill required fields",
          description: "Name, age, and relationship are required.",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddMember = async () => {
    setIsLoading(true);
    try {
      console.log('Adding member with data:', newMember);
      
      const memberData = {
        name: newMember.name,
        age: parseInt(newMember.age),
        gender: newMember.gender || null,
        relationship: newMember.relationship,
        weight: newMember.weight ? parseFloat(newMember.weight) : null,
        height: newMember.height ? parseFloat(newMember.height) : null,
        lifestyle: newMember.lifestyle || null,
        existing_conditions: newMember.existing_conditions.length > 0 ? newMember.existing_conditions : null,
        user_id: profile?.id
      };

      console.log('Inserting member data:', memberData);

      const { data, error } = await supabase
        .from('family_members')
        .insert(memberData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Member added successfully:', data);

      setFamilyMembers([...familyMembers, data]);
      setNewMember({ 
        name: '', 
        age: '', 
        gender: '', 
        relationship: '', 
        weight: '', 
        height: '', 
        lifestyle: '', 
        existing_conditions: [] 
      });
      setShowAddForm(false);
      setCurrentStep(1);

      toast({
        title: "Family member added successfully",
        description: `${data.name} has been added to your family dashboard.`,
      });
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Error",
        description: "Failed to add family member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only PDF or image files.",
        variant: "destructive",
      });
      return;
    }

    // Check file sizes (max 10MB each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 10MB each.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(files);
  };

  const handleUploadReports = async () => {
    if (!selectedMember || selectedFiles.length === 0) {
      toast({
        title: "Please select files and member",
        description: "Both member and files are required.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      for (const file of selectedFiles) {
        // Simulate AI analysis with more realistic processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Enhanced mock AI analysis results based on file type
        const isBloodTest = file.name.toLowerCase().includes('blood') || Math.random() > 0.5;
        
        const analysisResult = {
          insights: isBloodTest ? [
            'Hemoglobin levels are within normal range (13.5 g/dL)',
            'Cholesterol slightly elevated (215 mg/dL) - consider dietary changes',
            'Blood glucose excellent (88 mg/dL)',
            'Kidney function markers normal',
            'Vitamin D deficiency detected (18 ng/mL) - supplementation recommended'
          ] : [
            'Blood pressure readings normal (118/76 mmHg)',
            'Heart rate variability good',
            'No abnormal findings detected',
            'Overall cardiovascular health appears good',
            'Continue regular exercise routine'
          ],
          keyMetrics: isBloodTest ? {
            'Hemoglobin': '13.5 g/dL (Normal)',
            'Total Cholesterol': '215 mg/dL (Slightly High)',
            'Blood Glucose': '88 mg/dL (Normal)',
            'Creatinine': '0.9 mg/dL (Normal)',
            'Vitamin D': '18 ng/mL (Low)'
          } : {
            'Blood Pressure': '118/76 mmHg (Normal)',
            'Heart Rate': '72 bpm (Normal)',
            'BMI': '23.1 (Normal)',
            'Body Fat %': '18% (Healthy)'
          },
          riskFactors: isBloodTest ? [
            'Slightly elevated cholesterol',
            'Vitamin D deficiency'
          ] : [
            'No significant risk factors identified'
          ],
          recommendations: isBloodTest ? [
            'Increase fiber intake to 25-30g daily',
            'Start Vitamin D3 supplement (2000 IU daily)',
            'Limit saturated fats to <7% of total calories',
            'Regular cardio exercise 150 minutes/week',
            'Recheck cholesterol in 3 months'
          ] : [
            'Maintain current exercise routine',
            'Continue balanced diet',
            'Monitor blood pressure monthly',
            'Annual health checkup recommended'
          ]
        };

        // Save report to database
        const { data, error } = await supabase
          .from('family_health_reports')
          .insert({
            family_member_id: selectedMember.id,
            user_id: profile?.id,
            report_name: file.name.replace(/\.[^/.]+$/, ""),
            report_type: isBloodTest ? 'Blood Test' : 'Physical Exam',
            report_data: { fileName: file.name, fileSize: file.size },
            ai_analysis: analysisResult,
            good_indicators: analysisResult.insights.filter(insight => 
              insight.includes('normal') || insight.includes('excellent') || insight.includes('good')
            ),
            focus_areas: analysisResult.riskFactors,
            ai_suggestions: analysisResult.recommendations,
            file_url: URL.createObjectURL(file)
          })
          .select()
          .single();

        if (error) throw error;
      }

      // Reload reports
      await loadMemberReports(selectedMember.id);
      
      setSelectedFiles([]);
      setShowReportForm(false);

      toast({
        title: "Reports uploaded successfully!",
        description: `${selectedFiles.length} report(s) analyzed and saved for ${selectedMember.name}.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
      if (selectedMember?.id === memberId) {
        setSelectedMember(null);
      }

      toast({
        title: "Member removed",
        description: "Family member has been removed.",
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove family member.",
        variant: "destructive",
      });
    }
  };

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
    'High Cholesterol', 'Obesity', 'Depression', 'Anxiety', 'Migraine'
  ];

  const lifestyleOptions = [
    'Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'
  ];

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 w-full">
        <div className="w-full max-w-7xl mx-auto page-container space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">Family Dashboard</h1>
              <p className="text-gray-600">Monitor your family's health together</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
              <p className="text-purple-100 mb-6">
                Family monitoring with AI-powered health report analysis is available for Premium subscribers.
              </p>
              <Button 
                onClick={() => navigate('/subscription')}
                className="bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold"
              >
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If viewing a specific member
  if (selectedMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 w-full">
        <div className="w-full max-w-7xl mx-auto page-container space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setSelectedMember(null)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h1>
              <p className="text-gray-600">{selectedMember.relationship}, {selectedMember.age} years</p>
            </div>
          </div>

          {/* Member Health Summary */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Health Overview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-90">Reports: {memberReports.length}</p>
                      {selectedMember.weight && <p className="opacity-90">Weight: {selectedMember.weight}kg</p>}
                    </div>
                    <div>
                      {selectedMember.height && <p className="opacity-90">Height: {selectedMember.height}cm</p>}
                      {selectedMember.lifestyle && <p className="opacity-90">Activity: {selectedMember.lifestyle}</p>}
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Report Button */}
          <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold">
                <Upload className="w-5 h-5 mr-2" />
                Upload Health Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Reports for {selectedMember.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Files (PDF, Images)</Label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          📄 {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowReportForm(false);
                      setSelectedFiles([]);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadReports}
                    disabled={isUploading || selectedFiles.length === 0}
                    className="flex-1"
                  >
                    {isUploading ? 'Analyzing...' : 'Upload & Analyze'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Latest Report Analysis */}
          {memberReports.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Latest AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {memberReports[0].good_indicators && memberReports[0].good_indicators.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">🟢 Good Indicators</h4>
                    <ul className="space-y-1">
                      {memberReports[0].good_indicators.map((indicator, index) => (
                        <li key={index} className="text-sm text-green-700">• {indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {memberReports[0].focus_areas && memberReports[0].focus_areas.length > 0 && (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🔴 Focus Areas</h4>
                    <ul className="space-y-1">
                      {memberReports[0].focus_areas.map((area, index) => (
                        <li key={index} className="text-sm text-orange-700">• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {memberReports[0].ai_suggestions && memberReports[0].ai_suggestions.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 AI Suggestions</h4>
                    <ul className="space-y-1">
                      {memberReports[0].ai_suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-700">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* All Reports */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Health Reports ({memberReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {memberReports.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No health reports uploaded yet.</p>
              ) : (
                <div className="space-y-3">
                  {memberReports.map((report) => (
                    <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{report.report_name}</h4>
                          <p className="text-sm text-gray-600">{new Date(report.created_at).toLocaleDateString()}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {report.report_type}
                            </Badge>
                            {report.good_indicators && report.good_indicators.length > 0 && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                {report.good_indicators.length} Good
                              </Badge>
                            )}
                            {report.focus_areas && report.focus_areas.length > 0 && (
                              <Badge className="text-xs bg-orange-100 text-orange-800">
                                {report.focus_areas.length} Concerns
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 w-full">
      <div className="w-full max-w-7xl mx-auto page-container space-y-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold text-gray-900">Family Dashboard</h1>
              <p className="text-gray-600">Monitor your family's health together</p>
            </div>
          </div>
          <Badge className="bg-yellow-500 text-white">
            ⭐ Premium
          </Badge>
        </div>

        {/* Family Overview */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-sky-500 to-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Family Members</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold">{familyMembers.length}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Active
                  </Badge>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Member Button */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold">
              <UserPlus className="w-5 h-5 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>Add Family Member - Step {currentStep} of 3</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age *</Label>
                      <Input
                        type="number"
                        value={newMember.age}
                        onChange={(e) => setNewMember({...newMember, age: e.target.value})}
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={newMember.gender} onValueChange={(value) => setNewMember({...newMember, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Relationship *</Label>
                    <Input
                      value={newMember.relationship}
                      onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                      placeholder="e.g., Father, Mother, Child, Spouse"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Physical Information */}
              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={newMember.weight}
                        onChange={(e) => setNewMember({...newMember, weight: e.target.value})}
                        placeholder="70"
                      />
                    </div>
                    <div>
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        value={newMember.height}
                        onChange={(e) => setNewMember({...newMember, height: e.target.value})}
                        placeholder="170"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Lifestyle Activity Level</Label>
                    <Select value={newMember.lifestyle} onValueChange={(value) => setNewMember({...newMember, lifestyle: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        {lifestyleOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Step 3: Health Conditions */}
              {currentStep === 3 && (
                <>
                  <div>
                    <Label>Existing Conditions (Optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commonConditions.map((condition) => (
                        <Badge
                          key={condition}
                          variant={newMember.existing_conditions.includes(condition) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            const conditions = newMember.existing_conditions.includes(condition)
                              ? newMember.existing_conditions.filter(c => c !== condition)
                              : [...newMember.existing_conditions, condition];
                            setNewMember({...newMember, existing_conditions: conditions});
                          }}
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    className="flex-1"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddMember}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Adding...' : 'Add Member'}
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setCurrentStep(1);
                    setNewMember({ name: '', age: '', gender: '', relationship: '', weight: '', height: '', lifestyle: '', existing_conditions: [] });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Family Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => (
            <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.relationship}, {member.age} years old
                        {member.gender && ` • ${member.gender}`}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                        {member.weight && (
                          <span className="flex items-center space-x-1">
                            <Weight className="w-3 h-3" />
                            <span>{member.weight}kg</span>
                          </span>
                        )}
                        {member.height && (
                          <span>{member.height}cm</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteMember(member.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {member.existing_conditions && member.existing_conditions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {member.existing_conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => {
                    setSelectedMember(member);
                    loadMemberReports(member.id);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Health Reports
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {familyMembers.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members Yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first family member to track their health.</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FamilyDashboard;
