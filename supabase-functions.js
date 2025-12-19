// Waitlist Functions
const waitlistFunctions = {
    // Submit waitlist application
    async submitWaitlistApplication(formData) {
        try {
            console.log('Submitting waitlist application:', formData);
            
            const { data, error } = await window.supabaseClient
                .from('waitlist_applications')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    social_platform: formData.socialPlatform,
                    profile_link: formData.profileLink,
                    audience_size: formData.audienceSize,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) {
                // Check if it's a duplicate email error
                if (error.code === '23505') {
                    return {
                        success: false,
                        error: 'This email is already on our waitlist!'
                    };
                }
                throw error;
            }
            
            return {
                success: true,
                data: data[0],
                message: 'Application submitted successfully!'
            };
            
        } catch (error) {
            console.error('Error submitting waitlist:', error);
            return {
                success: false,
                error: error.message || 'Failed to submit application'
            };
        }
    },
    
    // Get waitlist count
    async getWaitlistCount() {
        try {
            const { count, error } = await window.supabaseClient
                .from('waitlist_applications')
                .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            
            return {
                success: true,
                count: count || 0
            };
            
        } catch (error) {
            console.error('Error getting waitlist count:', error);
            return {
                success: false,
                count: 4204 // Fallback number
            };
        }
    },
    
    // Get recent applications for dashboard
    async getRecentApplications(limit = 10) {
        try {
            const { data, error } = await window.supabaseClient
                .from('waitlist_applications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            
            return {
                success: true,
                data: data || []
            };
            
        } catch (error) {
            console.error('Error getting recent applications:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    
    // Check if email already exists
    async checkEmailExists(email) {
        try {
            const { data, error } = await window.supabaseClient
                .from('waitlist_applications')
                .select('email')
                .eq('email', email)
                .limit(1);
            
            if (error) throw error;
            
            return data && data.length > 0;
            
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    },
    
    // Get dashboard stats
    async getDashboardStats() {
        try {
            // Get waitlist count
            const { count, error: countError } = await window.supabaseClient
                .from('waitlist_applications')
                .select('*', { count: 'exact', head: true });
            
            if (countError) throw countError;
            
            // In a real app, you'd get these from your actual database
            // For now, we'll use static data or fetch from dashboard_stats table
            return {
                success: true,
                stats: {
                    applications_count: count || 4204,
                    total_revenue: '$4.2M',
                    active_courses: '5',
                    status: 'Scaling'
                }
            };
            
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            return {
                success: false,
                stats: {
                    applications_count: 4204,
                    total_revenue: '$4.2M',
                    active_courses: '5',
                    status: 'Scaling'
                }
            };
        }
    }
};

// Admin Authentication Functions
const adminFunctions = {
    // Simple key-based authentication (for demo)
    async authenticateAdmin(accessKey) {
        try {
            // In production, use environment variables
            const validKeys = [
                'ALPHA-88', 
                process.env.ADMIN_ACCESS_KEY || 'ADMIN-123'
            ];
            
            if (validKeys.includes(accessKey)) {
                // Store authentication in localStorage
                localStorage.setItem('scalebound_admin', 'true');
                localStorage.setItem('scalebound_admin_key', accessKey);
                localStorage.setItem('scalebound_expires', Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
                
                return {
                    success: true,
                    message: 'Authentication successful'
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid access key'
                };
            }
            
        } catch (error) {
            console.error('Auth error:', error);
            return {
                success: false,
                error: 'Authentication failed'
            };
        }
    },
    
    // Check if admin is authenticated
    isAdminAuthenticated() {
        try {
            const isAdmin = localStorage.getItem('scalebound_admin');
            const expires = localStorage.getItem('scalebound_expires');
            
            if (isAdmin === 'true' && expires && Date.now() < parseInt(expires)) {
                return true;
            }
            
            // Clear invalid session
            this.logoutAdmin();
            return false;
            
        } catch (error) {
            return false;
        }
    },
    
    // Logout admin
    logoutAdmin() {
        localStorage.removeItem('scalebound_admin');
        localStorage.removeItem('scalebound_admin_key');
        localStorage.removeItem('scalebound_expires');
    },
    
    // Get admin info
    getAdminInfo() {
        return {
            isAuthenticated: this.isAdminAuthenticated(),
            key: localStorage.getItem('scalebound_admin_key')
        };
    }
};

// Export all functions
window.supabaseFunctions = {
    ...waitlistFunctions,
    ...adminFunctions
};

console.log('✅ Supabase functions loaded');
