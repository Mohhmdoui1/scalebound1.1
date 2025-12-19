// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://inpgbkngltxfpomrktpt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_i9zfqAOv408XDlrxxs6soA_U7nge0nI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;

console.log('✅ Supabase initialized');