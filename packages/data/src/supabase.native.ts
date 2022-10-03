import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SUPABASE_URL = 'https://eddyjgvaopluagbuynoi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZHlqZ3Zhb3BsdWFnYnV5bm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzcyNzEsImV4cCI6MTk3ODA1MzI3MX0.HcBAsuWBWK3yT0yLY6WZYI4UO5R2D7CXyUoXs5_2ByY'

const supabase = createClient(
  SUPABASE_URL as string, 
  SUPABASE_ANON_KEY as string,
  {
    localStorage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
)

export default supabase