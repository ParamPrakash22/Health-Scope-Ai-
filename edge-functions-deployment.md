# Edge Functions Deployment Guide

## Functions to Deploy

### 1. Chat Function
**Path:** `supabase/functions/chat/index.ts`

**Environment Variables Needed:**
- `OPENAI_API_KEY` (keep your existing key)

### 2. Analyze Food Function  
**Path:** `supabase/functions/analyze-food/index.ts`

**Environment Variables Needed:**
- No additional environment variables (uses hardcoded Nutritionix API keys)

### 3. Analyze Health Report Function
**Path:** `supabase/functions/analyze-health-report/index.ts`

**Environment Variables Needed:**
- `OPENAI_API_KEY` (keep your existing key)
- `SUPABASE_URL` (your new Supabase project URL)
- `SUPABASE_ANON_KEY` (your new Supabase anon key)

## Deployment Commands

Run these commands in your new Supabase project directory:

```bash
# Deploy chat function
supabase functions deploy chat

# Deploy analyze-food function  
supabase functions deploy analyze-food

# Deploy analyze-health-report function
supabase functions deploy analyze-health-report
```

## Function Configuration

After deployment, configure the functions in your Supabase dashboard:

1. Go to Edge Functions in your Supabase dashboard
2. For each function, set the environment variables
3. For `chat` and `analyze-health-report` functions, set `verify_jwt = false` in the function settings
