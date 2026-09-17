import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://udztlpzldtinahcsfejk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkenRscHpsZHRpbmFoY3NmZWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NDc5NDAsImV4cCI6MjEwNTEyMzk0MH0.rgdMfx-nFDy1IKzIm-wgRwWcGsAx9yzfDeloBHduAF4";

if (!supabaseUrl || !supabaseAnonKey) {
  // Message clair en dev si les variables ne sont pas configurées
  console.error(
    "⚠️ Variables Supabase manquantes. Vérifie ton fichier .env (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY)."
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
