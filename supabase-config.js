// Supabase Configuration - Use IIFE to avoid polluting global scope
(function() {
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://inpgbkngltxfpomrktpt.supabase.co';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_i9zfqAOv408XDlrxxs6soA_U7nge0nI';

    // Only initialize if not already initialized
    if (!window.supabaseClient) {
        const { createClient } = window.supabase;
        window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized');
    } else {
        console.log('✅ Supabase already initialized');
    }
})();
