
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://gctccpthpoegyrqepelm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdGNjcHRocG9lZ3lycWVwZWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzUxMjEsImV4cCI6MjA3MjcxMTEyMX0.X5YCi-ro3cFQhYJAEW7aSJ3U-9FVZ-sQs-O1gfNIuyw'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
