import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Embedded project credentials with fallback support
const SUPABASE_URL = 
  process.env.SUPABASE_URL || 'https://gxaunodcmpxnywrfcrcd.supabase.co';

const SUPABASE_KEY = 
  process.env.SUPABASE_KEY || 'sb_secret_kbMnr3NjI2LjwEpecvhDIA_iSY5V1nN';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});