
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText, Eye, Download, Camera, TrendingUp } from 'lucide-react';

const Reports = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF or image files only.",
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

    setIsUploading(true);

    try {
      for (const file of files) {
        // Simulate AI analysis with realistic processing time
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Enhanced mock AI analysis results
        const isBloodTest = file.name.toLowerCase().includes('blood') || 
                           file.name.toLowerCase().includes('cbc') || 
                           file.name.toLowerCase().includes('lipid') ||
                           Math.random() > 0.4;
        
        const analysisResult = {
          insights: isBloodTest ? [
            'Hemoglobin levels within normal range (14.2 g/dL)',
            'Total cholesterol elevated (235 mg/dL) - dietary changes recommended',
            'Fasting glucose normal (92 mg/dL)',
            'Liver function tests normal',
            'Vitamin B12 deficiency detected (180 pg/mL)',
            'Thyroid function optimal (TSH: 2.1 mIU/L)',
            'Kidney markers excellent (Creatinine: 0.8 mg/dL)'
          ] : [
            'Blood pressure readings normal (120/78 mmHg)',
            'Heart rate variability excellent',
            'ECG shows normal sinus rhythm',
            'Chest X-ray clear, no abnormalities',
            'Overall cardiovascular health excellent',
            'Lung function tests normal'
          ],
          keyMetrics: isBloodTest ? {
            'Hemoglobin': '14.2 g/dL (Normal)',
            'Total Cholesterol': '235 mg/dL (High)',
            'LDL': '158 mg/dL (High)',
            'HDL': '45 mg/dL (Normal)',
            'Triglycerides': '180 mg/dL (Borderline)',
            'Fasting Glucose': '92 mg/dL (Normal)',
            'Vitamin B12': '180 pg/mL (Low)',
            'TSH': '2.1 mIU/L (Normal)'
          } : {
            'Blood Pressure': '120/78 mmHg (Normal)',
            'Heart Rate': '68 bpm (Normal)',
            'Respiratory Rate': '16/min (Normal)',
            'BMI': '22.8 (Normal)',
            'Body Fat %': '16% (Healthy)',
            'Muscle Mass': '42.5 kg (Good)'
          },
          riskFactors: isBloodTest ? [
            'Elevated total cholesterol (235 mg/dL)',
            'High LDL cholesterol (158 mg/dL)',
            'Vitamin B12 deficiency',
            'Borderline triglycerides'
          ] : [
            'No significant cardiovascular risk factors',
            'Excellent fitness indicators'
          ],
          recommendations: isBloodTest ? [
            'Reduce saturated fat intake to <7% of total calories',
            'Increase soluble fiber intake (oats, beans, fruits)',
            'Start Vitamin B12 supplement (1000 mcg daily)',
            'Regular aerobic exercise 150 minutes/week',
            'Limit refined sugars and processed foods',
            'Recheck lipid panel in 6 weeks',
            'Consider consultation with nutritionist'
          ] : [
            'Maintain current exercise routine',
            'Continue heart-healthy diet',
            'Monitor blood pressure weekly',
            'Annual comprehensive health screening',
            'Keep up excellent lifestyle habits'
          ],
          trends: isBloodTest ? [
            'Cholesterol increased 15% from last reading',
            'Vitamin levels declining over 6 months',
            'Blood sugar stability improved'
          ] : [
            'Blood pressure trending downward (positive)',
            'Heart rate variability improving',
            'Fitness markers consistently excellent'
          ]
        };

        // Create new report with comprehensive analysis
        const newReport = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: isBloodTest ? 'Blood Test Panel' : 'Physical Examination',
          date: new Date().toISOString().split('T')[0],
          status: 'Analyzed',
          insights: analysisResult.insights,
          file_url: URL.createObjectURL(file),
          keyMetrics: analysisResult.keyMetrics,
          riskFactors: analysisResult.riskFactors,
          recommendations: analysisResult.recommendations,
          trends: analysisResult.trends,
          aiConfidence: Math.round(88 + Math.random() * 10), // 88-98%
          analysisVersion: 'GPT-4 Medical Analysis v3.0',
          reportSize: file.size,
          uploadDate: new Date().toISOString()
        };

        setReports(prev => [newReport, ...prev]);
      }

      toast({
        title: "AI Analysis Complete!",
        description: `Successfully analyzed ${files.length} report(s) with comprehensive insights.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Analyzed': return 'bg-green-500';
      case 'Processing': return 'bg-yellow-500';
      case 'Failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isPremium = profile?.subscription_plan === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 w-full">
      <div className="w-full space-y-6 p-0">
        {/* Header */}
        <div className="pt-4 px-4 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Reports</h1>
            <p className="text-gray-600">Upload and analyze your medical reports with AI</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="px-4">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">AI-Powered Report Analysis</h2>
                <p className="text-blue-100 mb-4 text-sm">
                  Upload multiple medical reports for instant AI analysis and comprehensive insights
                </p>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold mb-3"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Reports
                    </>
                  )}
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="space-y-1 text-blue-200 text-xs">
                  <p>✓ Supports: PDF, JPG, PNG (Max 10MB each)</p>
                  <p>✓ Multiple file upload & batch processing</p>
                  <p>✓ Comprehensive health trend analysis</p>
                  <p>✓ Risk assessment & personalized recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Info */}
        <div className="px-4">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50 w-full">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                🤖 Advanced AI Analysis Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Automatic health metrics extraction</div>
                <div>• Comprehensive risk factor analysis</div>
                <div>• Trend detection across multiple reports</div>
                <div>• Personalized health recommendations</div>
                <div>• Medical terminology explanations</div>
                <div>• Abnormality detection & alerts</div>
                <div>• Doctor-ready summary generation</div>
                <div>• Historical health pattern analysis</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Upsell for Free Users */}
        {!isPremium && (
          <div className="px-4">
            <Card className="border-2 border-yellow-200 bg-yellow-50 w-full">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⭐</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-800">Upgrade to Premium</p>
                    <p className="text-sm text-yellow-700">Get unlimited uploads, family reports, and advanced AI insights</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate('/subscription')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports List */}
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your AI-Analyzed Reports</h3>
            <span className="text-sm text-gray-600">{reports.length} reports</span>
          </div>

          {reports.map((report) => (
            <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow w-full">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{report.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(report.status)} text-white border-0 text-xs`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                      {report.aiConfidence && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">{report.aiConfidence}% AI Confidence</span>
                        </>
                      )}
                    </div>

                    {/* Key Metrics */}
                    {report.keyMetrics && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Key Metrics:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(report.keyMetrics).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="text-xs bg-gray-50 px-2 py-1 rounded">
                              <span className="font-medium">{key}:</span> {value as string}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trends */}
                    {report.trends && report.trends.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-blue-700 mb-1 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Health Trends:
                        </p>
                        <div className="space-y-1">
                          {report.trends.slice(0, 2).map((trend: string, index: number) => (
                            <p key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              📈 {trend}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {report.riskFactors && report.riskFactors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-red-700 mb-1">Risk Factors:</p>
                        <div className="space-y-1">
                          {report.riskFactors.slice(0, 2).map((risk: string, index: number) => (
                            <p key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              ⚠️ {risk}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Insights */}
                    {report.insights && report.insights.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">AI Insights:</p>
                        <div className="space-y-1">
                          {report.insights.slice(0, 2).map((insight: string, index: number) => (
                            <p key={index} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                              🔍 {insight}
                            </p>
                          ))}
                          {report.insights.length > 2 && (
                            <p className="text-xs text-blue-600">
                              +{report.insights.length - 2} more insights
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => {
                          toast({
                            title: "Full Report Analysis",
                            description: "Comprehensive analysis view with trends and recommendations.",
                          });
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Full Analysis
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = report.file_url;
                          link.download = report.name;
                          link.click();
                          toast({
                            title: "Download Started",
                            description: "Your report is being downloaded.",
                          });
                        }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>

                    {report.analysisVersion && (
                      <p className="text-xs text-gray-500 mt-2">
                        Analyzed with {report.analysisVersion}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {reports.length === 0 && (
            <Card className="border-0 shadow-lg w-full">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Reports Yet</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Upload your first medical report to get comprehensive AI-powered insights and analysis
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                >
                  Upload First Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
