import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HealthRecord {
  id: string;
  date: string;
  heartRate?: number;
  bloodPressure?: string;
  weight?: number;
  steps?: number;
  sleep?: number;
  mood?: string;
  notes?: string;
  sleepHours?: number;
  waterIntake?: number;
  stressLevel?: number;
  exerciseFrequency?: number;
}

interface FoodScan {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  date: string;
  image_url?: string;
  scan_type: 'manual' | 'barcode' | 'plate';
  meal_type?: string;
}

interface RiskAssessment {
  id: string;
  date: string;
  score: number;
  level: 'Low' | 'Medium' | 'High';
  suggestions: string[];
}

interface CurrentHealthData {
  sleepHours: number;
  waterIntake: number;
  junkFoodLevel: number;
  exerciseFrequency: number;
  stressLevel: number;
  steps: number;
  alcohol: number;
  smoking: boolean;
  height: number;
  weight: number;
  age: number;
  sleepQuality: number;
  fruitsVeggies: number;
  exerciseIntensity: number;
  screenTime: number;
  regularCheckups: boolean;
  familyHistory?: string[];
  sleepRestfulness?: string;
}

interface HealthContextType {
  healthHistory: HealthRecord[];
  foodScans: FoodScan[];
  riskHistory: RiskAssessment[];
  currentHealthData: CurrentHealthData;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  addFoodScan: (scan: Omit<FoodScan, 'id'>) => void;
  updateHealthData: (data: Partial<CurrentHealthData>) => void;
  calculateRisk: () => Promise<RiskAssessment>;
  getDailyCalories: (date?: string) => number;
  isLoading: boolean;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthHistory, setHealthHistory] = useState<HealthRecord[]>([]);
  const [foodScans, setFoodScans] = useState<FoodScan[]>([]);
  const [riskHistory, setRiskHistory] = useState<RiskAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentHealthData, setCurrentHealthData] = useState<CurrentHealthData>({
    sleepHours: 7,
    waterIntake: 2,
    junkFoodLevel: 2,
    exerciseFrequency: 3,
    stressLevel: 5,
    steps: 8000,
    alcohol: 0,
    smoking: false,
    height: 170,
    weight: 70,
    age: 30,
    sleepQuality: 7,
    fruitsVeggies: 3,
    exerciseIntensity: 5,
    screenTime: 6,
    regularCheckups: false,
    familyHistory: [],
    sleepRestfulness: '',
  });

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setHealthHistory(prev => [...prev, newRecord]);
  };

  const addFoodScan = (scan: Omit<FoodScan, 'id'>) => {
    const newScan: FoodScan = {
      ...scan,
      id: Date.now().toString(),
    };
    setFoodScans(prev => [...prev, newScan]);
  };

  const updateHealthData = (data: Partial<CurrentHealthData>) => {
    setCurrentHealthData(prev => ({ ...prev, ...data }));
  };

  const calculateRisk = async (): Promise<RiskAssessment> => {
    setIsLoading(true);
    
    try {
      let score = 100;
      const suggestions: string[] = [];

      if (currentHealthData.sleepHours < 6) {
        score -= 20;
        suggestions.push("Increase sleep to 7-9 hours for better recovery");
      }

      if (currentHealthData.waterIntake < 1.5) {
        score -= 15;
        suggestions.push("Increase water intake to at least 2 liters daily");
      }

      if (currentHealthData.exerciseFrequency < 2) {
        score -= 25;
        suggestions.push("Increase exercise to at least 3 times per week");
      }

      if (currentHealthData.stressLevel > 7) {
        score -= 20;
        suggestions.push("Practice stress management techniques");
      }

      if (currentHealthData.smoking) {
        score -= 30;
        suggestions.push("Consider quitting smoking for major health benefits");
      }

      // Additional risk factors
      if (currentHealthData.sleepQuality && currentHealthData.sleepQuality < 5) {
        score -= 10;
        suggestions.push("Improve sleep quality through better sleep hygiene");
      }

      if (currentHealthData.fruitsVeggies && currentHealthData.fruitsVeggies < 3) {
        score -= 15;
        suggestions.push("Increase daily fruit and vegetable intake to at least 5 servings");
      }

      if (currentHealthData.screenTime && currentHealthData.screenTime > 8) {
        score -= 10;
        suggestions.push("Reduce screen time to improve eye health and sleep quality");
      }

      if (currentHealthData.regularCheckups === false) {
        score -= 10;
        suggestions.push("Schedule regular medical checkups for preventive care");
      }

      score = Math.max(0, score);

      let level: 'Low' | 'Medium' | 'High';
      if (score >= 80) level = 'Low';
      else if (score >= 60) level = 'Medium';
      else level = 'High';

      if (suggestions.length === 0) {
        suggestions.push("Great job! Keep maintaining your healthy lifestyle");
      }

      const riskAssessment: RiskAssessment = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        score,
        level,
        suggestions,
      };

      setRiskHistory(prev => [...prev, riskAssessment]);
      return riskAssessment;
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyCalories = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return foodScans
      .filter(scan => scan.date === targetDate)
      .reduce((total, scan) => total + scan.calories, 0);
  };

  return (
    <HealthContext.Provider value={{
      healthHistory,
      foodScans,
      riskHistory,
      currentHealthData,
      addHealthRecord,
      addFoodScan,
      updateHealthData,
      calculateRisk,
      getDailyCalories,
      isLoading,
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
