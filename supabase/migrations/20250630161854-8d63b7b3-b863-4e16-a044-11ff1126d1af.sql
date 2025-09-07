
-- Add missing columns to family_members table
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS weight numeric,
ADD COLUMN IF NOT EXISTS height numeric,
ADD COLUMN IF NOT EXISTS lifestyle text;

-- Update the table to have better structure and ensure all necessary columns exist
ALTER TABLE public.family_members 
ALTER COLUMN age SET NOT NULL,
ALTER COLUMN relationship SET NOT NULL;

-- Add RLS policies for family_members table
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can create their own family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can update their own family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can delete their own family members" ON public.family_members;

-- Create policies for family members
CREATE POLICY "Users can view their own family members" 
  ON public.family_members 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own family members" 
  ON public.family_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family members" 
  ON public.family_members 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own family members" 
  ON public.family_members 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for family_health_reports table
ALTER TABLE public.family_health_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own family health reports" ON public.family_health_reports;
DROP POLICY IF EXISTS "Users can create their own family health reports" ON public.family_health_reports;
DROP POLICY IF EXISTS "Users can update their own family health reports" ON public.family_health_reports;
DROP POLICY IF EXISTS "Users can delete their own family health reports" ON public.family_health_reports;

-- Create policies for family health reports
CREATE POLICY "Users can view their own family health reports" 
  ON public.family_health_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own family health reports" 
  ON public.family_health_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family health reports" 
  ON public.family_health_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own family health reports" 
  ON public.family_health_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);
