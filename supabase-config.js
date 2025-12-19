// Supabase Configuration
(function initSupabase() {
    // Wait for the global 'supabase' object to be available from the CDN
    function checkForSupabase() {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            const SUPABASE_URL = 'https://inpgbkngltxfpomrktpt.supabase.co';
            const SUPABASE_ANON_KEY = 'sb_publishable_i9zfqAOv408XDlrxxs6soA_U7nge0nI';
            
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized successfully');
            
            // Notify that it's ready
            window.dispatchEvent(new Event('supabaseReady'));
        } else {
            // Try again in 100ms if not ready
            setTimeout(checkForSupabase, 100);
        }
    }
    
    // Start checking
    checkForSupabase();
})();
