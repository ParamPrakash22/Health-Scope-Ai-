# Complete HealthScope AI Backend Migration Guide

## Prerequisites
- New Supabase account with project created
- Supabase CLI installed (`npm install -g supabase`)
- Your existing API keys (OpenAI, Nutritionix)

## Step 1: Database Schema Migration

1. **Go to your new Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the entire content from `migration-complete-schema.sql`**
4. **Run the SQL script**

This will create:
- ✅ `profiles` table with RLS policies
- ✅ `family_members` table with RLS policies  
- ✅ `family_health_reports` table with RLS policies
- ✅ Triggers for `updated_at` columns
- ✅ User signup trigger

## Step 2: Edge Functions Deployment

### Option A: Using Supabase CLI (Recommended)

1. **Initialize Supabase in your project:**
   ```bash
   cd "/Users/ok/Documents/HEALTSCOPE AI/healthscope-ai-insights-main"
   supabase init
   ```

2. **Link to your new project:**
   ```bash
   supabase link --project-ref YOUR_NEW_PROJECT_ID
   ```

3. **Deploy all functions:**
   ```bash
   supabase functions deploy chat
   supabase functions deploy analyze-food
   supabase functions deploy analyze-health-report
   ```

### Option B: Manual Upload via Dashboard

1. **Go to Edge Functions in your Supabase dashboard**
2. **Create new function for each:**
   - Function name: `chat`
   - Function name: `analyze-food` 
   - Function name: `analyze-health-report`
3. **Copy the code from each `index.ts` file**

## Step 3: Environment Variables Setup

### In Supabase Dashboard → Settings → Edge Functions:

**For `chat` function:**
```
OPENAI_API_KEY=your_existing_openai_key
```

**For `analyze-health-report` function:**
```
OPENAI_API_KEY=your_existing_openai_key
SUPABASE_URL=https://your-new-project.supabase.co
SUPABASE_ANON_KEY=your_new_anon_key
```

**For `analyze-food` function:**
- No environment variables needed (uses hardcoded Nutritionix keys)

## Step 4: Function Configuration

In your Supabase dashboard, for each function:
1. **Go to Edge Functions → [function-name] → Settings**
2. **Set `verify_jwt = false`** for:
   - `chat` function
   - `analyze-health-report` function

## Step 5: Update Frontend Configuration

1. **Get your new Supabase credentials:**
   - Project URL
   - Anon key
   - Service role key (if needed)

2. **Update your frontend environment variables:**
   ```bash
   # In your .env file or environment
   VITE_SUPABASE_URL=https://your-new-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_new_anon_key
   ```

3. **Update the Supabase client configuration:**
   - File: `src/integrations/supabase/client.ts`
   - Replace the URL and anon key

## Step 6: Test Everything

1. **Test database operations:**
   - User signup/login
   - Create family members
   - Add health reports

2. **Test Edge Functions:**
   - Chat functionality
   - Food analysis
   - Health report analysis

3. **Test frontend integration:**
   - All pages should work with new backend
   - No API key changes needed

## Important Notes

✅ **API Keys Preserved:**
- OpenAI API key stays the same
- Nutritionix API keys stay the same (hardcoded in analyze-food function)

✅ **No Data Loss:**
- This migration only copies schema and functions
- Your existing data remains in the old account

✅ **Zero Downtime:**
- You can test the new setup before switching
- Frontend can be updated to point to new backend when ready

## Troubleshooting

**If functions fail to deploy:**
- Check environment variables are set correctly
- Verify JWT verification settings
- Check function logs in Supabase dashboard

**If database operations fail:**
- Verify RLS policies are created
- Check user authentication is working
- Verify triggers are created

**If frontend can't connect:**
- Double-check Supabase URL and keys
- Verify CORS settings
- Check network connectivity

## Next Steps After Migration

1. **Update your production environment variables**
2. **Test thoroughly in staging**
3. **Update DNS/domain settings if needed**
4. **Monitor logs for any issues**
5. **Decommission old Supabase project when confident**

---

**Need Help?** Check the Supabase documentation or contact support if you encounter any issues during migration.
