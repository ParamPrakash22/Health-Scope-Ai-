
-- Create family_health_reports table for storing uploaded reports and AI analysis
CREATE TABLE public.family_health_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'manual', -- 'pdf', 'image', 'manual'
  report_data JSONB, -- structured health data
  file_url TEXT, -- for uploaded files
  ai_analysis JSONB, -- GPT analysis results
  good_indicators TEXT[], -- positive health markers
  focus_areas TEXT[], -- areas that need attention
  ai_suggestions TEXT[], -- lifestyle and safety tips
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for family_health_reports
ALTER TABLE public.family_health_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their family's health reports" 
  ON public.family_health_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their family's health reports" 
  ON public.family_health_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their family's health reports" 
  ON public.family_health_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their family's health reports" 
  ON public.family_health_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add gender and existing_conditions columns to family_members table
ALTER TABLE public.family_members 
ADD COLUMN gender TEXT,
ADD COLUMN existing_conditions TEXT[],
ADD COLUMN avatar_url TEXT;

-- Add RLS policies for family_members table
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their family members" 
  ON public.family_members 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their family members" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their family members" 
  ON public.family_members 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their family members" 
  ON public.family_members 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at column
CREATE OR REPLACE TRIGGER update_family_health_reports_updated_at
  BEFORE UPDATE ON public.family_health_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
