// ============================================
// WAITLIST FUNCTIONS
// ============================================

async function handleWaitlistSubmit(e) {
    e.preventDefault();
    
    // Get form elements
    const form = document.getElementById('waitlist-form');
    const submitBtn = document.getElementById('waitlist-submit');
    const statusDiv = document.getElementById('waitlist-status');
    const loadingDiv = document.getElementById('waitlist-loading');
    
    // Get form data
    const formData = {
        firstName: document.getElementById('waitlist-first-name').value.trim(),
        lastName: document.getElementById('waitlist-last-name').value.trim(),
        email: document.getElementById('waitlist-email').value.trim().toLowerCase(),
        socialPlatform: document.querySelector('input[name="platform"]:checked')?.value,
        profileLink: document.getElementById('waitlist-profile').value.trim(),
        audienceSize: document.getElementById('waitlist-audience').value
    };
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.socialPlatform || !formData.profileLink || !formData.audienceSize) {
        showWaitlistStatus('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showWaitlistStatus('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    loadingDiv.classList.remove('hidden');
    statusDiv.classList.add('hidden');
    
    try {
        // Submit to Supabase
        const result = await window.supabaseFunctions.submitWaitlistApplication(formData);
        
        if (result.success) {
            showWaitlistStatus('✅ Application submitted successfully! We will contact you via email if you fit our criteria.', 'success');
            form.reset();
            
            // Update dashboard count if we're in dashboard
            updateDashboardStats();
            
            // Close waitlist after 3 seconds
            setTimeout(() => {
                hideWaitlist();
            }, 3000);
        } else {
            showWaitlistStatus(`❌ ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Waitlist submission error:', error);
        showWaitlistStatus('❌ An error occurred. Please try again.', 'error');
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        loadingDiv.classList.add('hidden');
    }
}

function showWaitlistStatus(message, type = 'success') {
    const statusDiv = document.getElementById('waitlist-status');
    statusDiv.textContent = message;
    statusDiv.className = `p-4 rounded-lg text-sm ${type === 'success' ? 'success-message' : 'error-message'}`;
    statusDiv.classList.remove('hidden');
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

async function handleLogin(e) {
    e.preventDefault();
    const input = document.getElementById('access-key');
    const error = document.getElementById('error-msg');
    
    const result = await window.supabaseFunctions.authenticateAdmin(input.value);
    
    if (result.success) {
        toggleModal();
        showDashboard();
    } else {
        error.classList.remove('hidden');
        input.classList.add('border-red-500');
    }
}

async function showDashboard() {
    const publicView = document.getElementById('main-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    publicView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    document.title = "ScaleBound | Command Center";
    
    // Load dashboard data
    await loadDashboardData();
}

async function loadDashboardData() {
    // Update applications count
    const countResult = await window.supabaseFunctions.getWaitlistCount();
    if (countResult.success) {
        document.getElementById('applications-count').textContent = countResult.count.toLocaleString();
    }
    
    // Load dashboard stats
    const statsResult = await window.supabaseFunctions.getDashboardStats();
    if (statsResult.success) {
        document.getElementById('applications-count').textContent = statsResult.stats.applications_count.toLocaleString();
        document.getElementById('total-revenue').textContent = statsResult.stats.total_revenue;
        document.getElementById('active-courses').textContent = statsResult.stats.active_courses;
        document.getElementById('status').textContent = statsResult.stats.status;
    }
    
    // Load recent applications (optional - you can implement this later)
    // const recentResult = await window.supabaseFunctions.getRecentApplications(5);
    // if (recentResult.success) {
    //     console.log('Recent applications:', recentResult.data);
    // }
}

async function updateDashboardStats() {
    const countResult = await window.supabaseFunctions.getWaitlistCount();
    if (countResult.success) {
        document.getElementById('applications-count').textContent = countResult.count.toLocaleString();
    }
}

// ============================================
// BASIC FUNCTIONS
// ============================================

// Mobile Menu Logic
const mobileMenu = document.getElementById('mobile-menu');
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Modal Logic
function toggleModal() {
    const modal = document.getElementById('auth-modal');
    const form = document.getElementById('access-form');
    const error = document.getElementById('error-msg');
    const input = document.getElementById('access-key');
    
    modal.classList.toggle('open');
    
    // Reset state when closing
    if(!modal.classList.contains('open')) {
        form.reset();
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
    }
}

// Waitlist Page Logic
function showWaitlist() {
    document.getElementById('waitlist-view').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideWaitlist() {
    document.getElementById('waitlist-view').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Logout Logic
function handleLogout() {
    window.supabaseFunctions.logoutAdmin();
    document.getElementById('main-view').classList.remove('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
    document.title = "ScaleBound | The Creator Partnership";
    checkScroll();
}

// Scroll Animation
const navbar = document.getElementById('navbar');
const revealElements = document.querySelectorAll('.reveal');

function checkScroll() {
    // Reveal Logic
    const triggerBottom = window.innerHeight / 5 * 4;
    revealElements.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            box.classList.add('active');
        }
    });

    // Floating Navbar Logic
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
}

// Use requestAnimationFrame for smoother scrolling
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            checkScroll();
            ticking = false;
        });
        ticking = true;
    }
});

checkScroll(); // Trigger once on load

// Three.js Background
const initThreeJS = () => {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.BufferGeometry();
    const particlesCount = 400; 
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30; 
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
    camera.position.z = 5;

    const animate = () => {
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js
    try {
        initThreeJS();
    } catch (error) {
        console.error('Three.js initialization error:', error);
    }
    
    // Waitlist form submission
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistSubmit);
    }
    
    // Access form submission
    const accessForm = document.getElementById('access-form');
    if (accessForm) {
        accessForm.addEventListener('submit', handleLogin);
    }
    
    // Check if admin is already authenticated
    if (window.supabaseFunctions && window.supabaseFunctions.isAdminAuthenticated()) {
        console.log('Admin already authenticated, showing dashboard');
        showDashboard();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#waitlist') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});