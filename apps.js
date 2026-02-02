/* ========================================
   YAN PLATFORM - MAIN JAVASCRIPT
   ======================================== */

// ========================================
// GLOBAL STATE MANAGEMENT
// ========================================
const AppState = {
    currentUser: null,
    currentPage: 'landing',
    applications: [],
    events: [],
    opportunities: [],
    auditLog: []
};

// ========================================
// DEMO USERS FOR AUTHENTICATION
// ========================================
const DEMO_USERS = {
    'admin@yan.org': {
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        organization: 'YAN Administration'
    },
    'member@yan.org': {
        password: 'member123',
        role: 'member',
        name: 'John Doe',
        organization: 'Youth Innovation Hub',
        country: 'Rwanda'
    },
    'applicant@yan.org': {
        password: 'applicant123',
        role: 'applicant',
        name: 'Jane Smith',
        applicationId: 'APP001'
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadDataFromStorage();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize sample data if empty
    initializeSampleData();
    
    // Show landing page by default
    showPage('landing');
    
    // Load preview content
    loadPreviewContent();
}

// ========================================
// DATA PERSISTENCE (LOCALSTORAGE)
// ========================================
function loadDataFromStorage() {
    const stored = localStorage.getItem('yanPlatformData');
    if (stored) {
        const data = JSON.parse(stored);
        AppState.applications = data.applications || [];
        AppState.events = data.events || [];
        AppState.opportunities = data.opportunities || [];
        AppState.auditLog = data.auditLog || [];
    }
}

function saveDataToStorage() {
    const data = {
        applications: AppState.applications,
        events: AppState.events,
        opportunities: AppState.opportunities,
        auditLog: AppState.auditLog
    };
    localStorage.setItem('yanPlatformData', JSON.stringify(data));
}

function saveUserSession(user) {
    localStorage.setItem('yanCurrentUser', JSON.stringify(user));
    AppState.currentUser = user;
}

function clearUserSession() {
    localStorage.removeItem('yanCurrentUser');
    AppState.currentUser = null;
}

function checkAuthStatus() {
    const stored = localStorage.getItem('yanCurrentUser');
    if (stored) {
        AppState.currentUser = JSON.parse(stored);
        updateUIForLoggedInUser();
    }
}

// ========================================
// SAMPLE DATA INITIALIZATION
// ========================================
function initializeSampleData() {
    // Initialize sample applications if empty
    if (AppState.applications.length === 0) {
        AppState.applications = [
            {
                id: 'APP001',
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@example.com',
                phone: '+250788123456',
                country: 'Rwanda',
                age: 24,
                orgName: 'Youth Empowerment Initiative',
                orgType: 'NGO',
                position: 'Programs Director',
                orgWebsite: 'https://yei.org',
                focusAreas: ['Education', 'Gender'],
                motivation: 'I want to join YAN to expand my network and learn from other youth advocates...',
                experience: 'I have 3 years of experience working on youth empowerment programs...',
                contribution: 'I can contribute training expertise and project management skills...',
                status: 'pending',
                submittedDate: '2026-01-15',
                agreeTerms: true
            },
            {
                id: 'APP002',
                firstName: 'David',
                lastName: 'Kamau',
                email: 'david@example.com',
                phone: '+254712345678',
                country: 'Kenya',
                age: 27,
                orgName: 'Climate Action Youth',
                orgType: 'Youth Group',
                position: 'Founder',
                orgWebsite: '',
                focusAreas: ['Environment', 'Advocacy'],
                motivation: 'Environmental advocacy is my passion and YAN can help amplify our voice...',
                experience: 'Led multiple climate action campaigns in my community...',
                contribution: 'Environmental expertise and grassroots mobilization skills...',
                status: 'under_review',
                submittedDate: '2026-01-20',
                agreeTerms: true
            },
            {
                id: 'APP003',
                firstName: 'Sarah',
                lastName: 'Nkunda',
                email: 'sarah@example.com',
                phone: '+250789654321',
                country: 'Rwanda',
                age: 22,
                orgName: 'Digital Skills Academy',
                orgType: 'Social Enterprise',
                position: 'Co-founder',
                orgWebsite: 'https://dsa.rw',
                focusAreas: ['Digital', 'Economic'],
                motivation: 'To connect with other tech-focused youth advocates...',
                experience: 'Built a successful social enterprise teaching digital skills...',
                contribution: 'Digital literacy training and tech solutions...',
                status: 'accepted',
                submittedDate: '2026-01-10',
                agreeTerms: true
            }
        ];
        saveDataToStorage();
    }
    
    // Initialize sample events
    if (AppState.events.length === 0) {
        AppState.events = [
            {
                id: 'EVT001',
                title: 'Youth Leadership Summit 2026',
                date: '2026-02-15',
                time: '09:00',
                location: 'Kigali, Rwanda',
                description: 'Annual summit bringing together youth advocates from across Africa'
            },
            {
                id: 'EVT002',
                title: 'Advocacy Workshop Series',
                date: '2026-02-20',
                time: '14:00',
                location: 'Virtual',
                description: 'Interactive workshop on effective advocacy strategies'
            }
        ];
        saveDataToStorage();
    }
    
    // Initialize sample opportunities
    if (AppState.opportunities.length === 0) {
        AppState.opportunities = [
            {
                id: 'OPP001',
                title: 'Youth Innovation Fund 2026',
                category: 'funding',
                description: 'Grants up to $10,000 for innovative youth-led projects',
                deadline: '2026-03-15',
                amount: '$10,000',
                location: 'Pan-African'
            },
            {
                id: 'OPP002',
                title: 'Advanced Leadership Academy',
                category: 'training',
                description: 'Intensive 6-week leadership training program',
                deadline: '2026-02-20',
                type: 'Certificate Program',
                location: 'Virtual + In-person'
            }
        ];
        saveDataToStorage();
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
function initializeEventListeners() {
    // Navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Application form navigation
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (nextBtn) nextBtn.addEventListener('click', nextApplicationStep);
    if (prevBtn) prevBtn.addEventListener('click', prevApplicationStep);
    if (submitBtn) submitBtn.addEventListener('click', submitApplication);
    
    // Application form
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
    
    // Admin filters
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterApplications);
    }
    
    // Resource filters
    const resourceCategory = document.getElementById('resourceCategory');
    if (resourceCategory) {
        resourceCategory.addEventListener('change', filterResources);
    }
    
    // Opportunity filters
    const opportunityCategory = document.getElementById('opportunityCategory');
    const opportunityDeadline = document.getElementById('opportunityDeadline');
    if (opportunityCategory) {
        opportunityCategory.addEventListener('change', filterOpportunities);
    }
    if (opportunityDeadline) {
        opportunityDeadline.addEventListener('change', filterOpportunities);
    }
    
    // Collaboration tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Calendar navigation
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    if (prevMonth) prevMonth.addEventListener('click', () => navigateCalendar(-1));
    if (nextMonth) nextMonth.addEventListener('click', () => navigateCalendar(1));
    
    // Create event button
    const createEventBtn = document.getElementById('createEventBtn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', () => openModal('createEventModal'));
    }
    
    // Save event button
    const saveEventBtn = document.getElementById('saveEventBtn');
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', createEvent);
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });
    
    // Approve/Reject application buttons
    const approveBtn = document.getElementById('approveApplicationBtn');
    const rejectBtn = document.getElementById('rejectApplicationBtn');
    if (approveBtn) approveBtn.addEventListener('click', () => updateApplicationStatus('accepted'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => updateApplicationStatus('rejected'));
}

// ========================================
// PAGE NAVIGATION
// ========================================
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Handle role-based page access
    if (!canAccessPage(pageName)) {
        showAlert('error', 'Access denied. Please log in with appropriate permissions.');
        pageName = 'landing';
    }
    
    // Show requested page
    let pageId = pageName + 'Page';
    if (pageName === 'landing') pageId = 'landingPage';
    if (pageName === 'login') pageId = 'loginPage';
    if (pageName === 'apply') pageId = 'applyPage';
    if (pageName === 'resources') pageId = 'resourcesPage';
    if (pageName === 'opportunities') pageId = 'opportunitiesPage';
    if (pageName === 'events') pageId = 'eventsPage';
    
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        AppState.currentPage = pageName;
        
        // Load page-specific content
        loadPageContent(pageName);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

function canAccessPage(pageName) {
    const publicPages = ['landing', 'login', 'apply', 'about', 'opportunities', 'events'];
    const memberPages = ['memberDashboard', 'resources', 'profile'];
    const adminPages = ['adminDashboard'];
    
    if (publicPages.includes(pageName)) return true;
    
    if (!AppState.currentUser) return false;
    
    if (adminPages.includes(pageName) && AppState.currentUser.role !== 'admin') return false;
    if (memberPages.includes(pageName) && AppState.currentUser.role === 'applicant') return false;
    
    return true;
}

function loadPageContent(pageName) {
    switch(pageName) {
        case 'adminDashboard':
            loadAdminDashboard();
            break;
        case 'memberDashboard':
            loadMemberDashboard();
            break;
        case 'resources':
            loadResourcesPage();
            break;
        case 'opportunities':
            loadOpportunitiesPage();
            break;
        case 'events':
            loadEventsPage();
            break;
        case 'applicationStatus':
            loadApplicationStatus();
            break;
    }
}

// ========================================
// AUTHENTICATION
// ========================================
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const alert = document.getElementById('loginAlert');
    
    // Validate credentials
    if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
        const user = DEMO_USERS[email];
        saveUserSession({ email, ...user });
        updateUIForLoggedInUser();
        
        // Redirect based on role
        if (user.role === 'admin') {
            showPage('adminDashboard');
        } else if (user.role === 'member') {
            showPage('memberDashboard');
        } else if (user.role === 'applicant') {
            showPage('applicationStatus');
        }
        
        showAlertInElement(alert, 'success', 'Login successful!');
    } else {
        showAlertInElement(alert, 'error', 'Invalid email or password');
    }
}

function handleLogout() {
    clearUserSession();
    updateUIForLoggedOutUser();
    showPage('landing');
}

function updateUIForLoggedInUser() {
    // Hide auth buttons
    document.querySelectorAll('.auth-buttons').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show user menu
    document.querySelectorAll('.user-menu').forEach(el => {
        el.classList.remove('hidden');
    });
    
    // Update user name
    const userName = document.getElementById('userName');
    if (userName && AppState.currentUser) {
        userName.textContent = AppState.currentUser.name;
    }
    
    // Add admin/member specific nav items
    updateNavigationForRole();
}

function updateUIForLoggedOutUser() {
    // Show auth buttons
    document.querySelectorAll('.auth-buttons').forEach(el => {
        el.classList.remove('hidden');
    });
    
    // Hide user menu
    document.querySelectorAll('.user-menu').forEach(el => {
        el.classList.add('hidden');
    });
}

function updateNavigationForRole() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu || !AppState.currentUser) return;
    
    // Remove existing role-specific items
    navMenu.querySelectorAll('.role-specific').forEach(el => el.remove());
    
    // Add role-specific navigation
    if (AppState.currentUser.role === 'admin') {
        const adminLink = document.createElement('li');
        adminLink.className = 'role-specific';
        adminLink.innerHTML = '<a href="#" data-page="adminDashboard">Admin Dashboard</a>';
        navMenu.insertBefore(adminLink, navMenu.querySelector('.auth-buttons') || navMenu.querySelector('.user-menu'));
        
        // Re-attach event listener
        adminLink.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            showPage('adminDashboard');
        });
    } else if (AppState.currentUser.role === 'member') {
        const dashboardLink = document.createElement('li');
        dashboardLink.className = 'role-specific';
        dashboardLink.innerHTML = '<a href="#" data-page="memberDashboard">Dashboard</a>';
        navMenu.insertBefore(dashboardLink, navMenu.querySelector('.auth-buttons') || navMenu.querySelector('.user-menu'));
        
        dashboardLink.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            showPage('memberDashboard');
        });
    }
}

// ========================================
// APPLICATION FORM - MULTI-STEP
// ========================================
let currentStep = 1;
const totalSteps = 4;

function nextApplicationStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateApplicationStep();
        }
    }
}

function prevApplicationStep() {
    if (currentStep > 1) {
        currentStep--;
        updateApplicationStep();
    }
}

function updateApplicationStep() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update form steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.classList.toggle('hidden', currentStep === 1);
    
    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        populateReviewSection();
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    // Special validation for checkboxes in step 2
    if (currentStep === 2) {
        const checkboxes = currentStepElement.querySelectorAll('input[type="checkbox"][name="focusAreas"]');
        const checked = Array.from(checkboxes).some(cb => cb.checked);
        if (!checked) {
            alert('Please select at least one focus area');
            isValid = false;
        }
    }
    
    if (!isValid) {
        alert('Please fill in all required fields');
    }
    
    return isValid;
}

function populateReviewSection() {
    const form = document.getElementById('applicationForm');
    const formData = new FormData(form);
    const reviewSection = document.getElementById('reviewSection');
    
    // Get focus areas
    const focusAreas = [];
    document.querySelectorAll('input[name="focusAreas"]:checked').forEach(cb => {
        focusAreas.push(cb.value);
    });
    
    const data = {
        'First Name': formData.get('firstName'),
        'Last Name': formData.get('lastName'),
        'Email': formData.get('email'),
        'Phone': formData.get('phone'),
        'Country': formData.get('country'),
        'Age': formData.get('age'),
        'Organization': formData.get('orgName'),
        'Organization Type': formData.get('orgType'),
        'Position': formData.get('position'),
        'Website': formData.get('orgWebsite') || 'N/A',
        'Focus Areas': focusAreas.join(', '),
        'Motivation': formData.get('motivation'),
        'Experience': formData.get('experience'),
        'Contribution': formData.get('contribution')
    };
    
    let html = '';
    for (const [key, value] of Object.entries(data)) {
        html += `
            <div class="review-item">
                <strong>${key}:</strong>
                <span>${value}</span>
            </div>
        `;
    }
    
    reviewSection.innerHTML = html;
}

function submitApplication(e) {
    e.preventDefault();
    
    const form = document.getElementById('applicationForm');
    const formData = new FormData(form);
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!agreeTerms) {
        alert('Please agree to the terms and conditions');
        return;
    }
    
    // Get focus areas
    const focusAreas = [];
    document.querySelectorAll('input[name="focusAreas"]:checked').forEach(cb => {
        focusAreas.push(cb.value);
    });
    
    // Create application object
    const application = {
        id: 'APP' + String(AppState.applications.length + 1).padStart(3, '0'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        age: formData.get('age'),
        orgName: formData.get('orgName'),
        orgType: formData.get('orgType'),
        position: formData.get('position'),
        orgWebsite: formData.get('orgWebsite'),
        focusAreas: focusAreas,
        motivation: formData.get('motivation'),
        experience: formData.get('experience'),
        contribution: formData.get('contribution'),
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        agreeTerms: agreeTerms
    };
    
    // Save application
    AppState.applications.push(application);
    saveDataToStorage();
    
    // Add to audit log
    addAuditLog('application_submitted', `New application from ${application.firstName} ${application.lastName}`);
    
    // Reset form
    form.reset();
    currentStep = 1;
    updateApplicationStep();
    
    // Show success message
    alert('Application submitted successfully! You will receive an email once your application is reviewed.');
    
    // Redirect to landing page
    showPage('landing');
}

// ========================================
// ADMIN DASHBOARD
// ========================================
function loadAdminDashboard() {
    // Update metrics
    const totalApplications = AppState.applications.length;
    const pendingApplications = AppState.applications.filter(app => app.status === 'pending').length;
    const approvedMembers = AppState.applications.filter(app => app.status === 'accepted').length;
    const activeEvents = AppState.events.length;
    
    document.getElementById('totalApplications').textContent = totalApplications;
    document.getElementById('pendingApplications').textContent = pendingApplications;
    document.getElementById('approvedMembers').textContent = approvedMembers;
    document.getElementById('activeEvents').textContent = activeEvents;
    
    // Load applications table
    loadApplicationsTable();
    
    // Load audit log
    loadAuditLog();
}

function loadApplicationsTable(filter = 'all') {
    const tbody = document.getElementById('applicationsTable');
    if (!tbody) return;
    
    let applications = AppState.applications;
    if (filter !== 'all') {
        applications = applications.filter(app => app.status === filter);
    }
    
    tbody.innerHTML = '';
    
    applications.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.id}</td>
            <td>${app.firstName} ${app.lastName}</td>
            <td>${app.email}</td>
            <td>${app.country}</td>
            <td>${app.orgName}</td>
            <td><span class="badge ${app.status}">${app.status.replace('_', ' ').toUpperCase()}</span></td>
            <td>${app.submittedDate}</td>
            <td>
                <button class="btn btn-outline btn-small" onclick="viewApplication('${app.id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterApplications() {
    const filter = document.getElementById('statusFilter').value;
    loadApplicationsTable(filter);
}

function viewApplication(appId) {
    const application = AppState.applications.find(app => app.id === appId);
    if (!application) return;
    
    const modalBody = document.getElementById('applicationDetails');
    modalBody.innerHTML = `
        <div class="review-section">
            <h4>Personal Information</h4>
            <div class="review-item"><strong>Name:</strong> ${application.firstName} ${application.lastName}</div>
            <div class="review-item"><strong>Email:</strong> ${application.email}</div>
            <div class="review-item"><strong>Phone:</strong> ${application.phone}</div>
            <div class="review-item"><strong>Country:</strong> ${application.country}</div>
            <div class="review-item"><strong>Age:</strong> ${application.age}</div>
            
            <h4>Organization Information</h4>
            <div class="review-item"><strong>Organization:</strong> ${application.orgName}</div>
            <div class="review-item"><strong>Type:</strong> ${application.orgType}</div>
            <div class="review-item"><strong>Position:</strong> ${application.position}</div>
            <div class="review-item"><strong>Website:</strong> ${application.orgWebsite || 'N/A'}</div>
            <div class="review-item"><strong>Focus Areas:</strong> ${application.focusAreas.join(', ')}</div>
            
            <h4>Motivation & Experience</h4>
            <div class="review-item"><strong>Motivation:</strong> ${application.motivation}</div>
            <div class="review-item"><strong>Experience:</strong> ${application.experience}</div>
            <div class="review-item"><strong>Contribution:</strong> ${application.contribution}</div>
            
            <h4>Application Details</h4>
            <div class="review-item"><strong>Application ID:</strong> ${application.id}</div>
            <div class="review-item"><strong>Status:</strong> <span class="badge ${application.status}">${application.status.toUpperCase()}</span></div>
            <div class="review-item"><strong>Submitted:</strong> ${application.submittedDate}</div>
        </div>
    `;
    
    // Store current application ID for approve/reject actions
    window.currentApplicationId = appId;
    
    openModal('applicationModal');
}

function updateApplicationStatus(newStatus) {
    const appId = window.currentApplicationId;
    const application = AppState.applications.find(app => app.id === appId);
    
    if (!application) return;
    
    application.status = newStatus;
    saveDataToStorage();
    
    // Add to audit log
    const action = newStatus === 'accepted' ? 'application_approved' : 'application_rejected';
    addAuditLog(action, `Application ${appId} ${newStatus} by admin`);
    
    // Refresh dashboard
    loadAdminDashboard();
    
    // Close modal
    closeModal('applicationModal');
    
    alert(`Application ${newStatus} successfully!`);
}

function addAuditLog(action, description) {
    const logEntry = {
        id: 'LOG' + Date.now(),
        action: action,
        description: description,
        timestamp: new Date().toISOString(),
        user: AppState.currentUser ? AppState.currentUser.name : 'System'
    };
    
    AppState.auditLog.unshift(logEntry);
    
    // Keep only last 50 entries
    if (AppState.auditLog.length > 50) {
        AppState.auditLog = AppState.auditLog.slice(0, 50);
    }
    
    saveDataToStorage();
}

function loadAuditLog() {
    const auditLogContainer = document.getElementById('auditLog');
    if (!auditLogContainer) return;
    
    auditLogContainer.innerHTML = '';
    
    const recentLogs = AppState.auditLog.slice(0, 10);
    
    if (recentLogs.length === 0) {
        auditLogContainer.innerHTML = '<p class="empty-state">No activity yet</p>';
        return;
    }
    
    recentLogs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'audit-item';
        logItem.innerHTML = `
            <div><strong>${log.action.replace('_', ' ').toUpperCase()}</strong></div>
            <div>${log.description}</div>
            <div class="timestamp">${new Date(log.timestamp).toLocaleString()}</div>
        `;
        auditLogContainer.appendChild(logItem);
    });
}

// ========================================
// MEMBER DASHBOARD
// ========================================
function loadMemberDashboard() {
    if (!AppState.currentUser) return;
    
    // Update member name
    const memberName = document.getElementById('memberName');
    if (memberName) {
        memberName.textContent = AppState.currentUser.name;
    }
    
    // Update profile section
    const profileName = document.getElementById('profileName');
    const profileOrg = document.getElementById('profileOrg');
    const profileCountry = document.getElementById('profileCountry');
    const avatarInitials = document.getElementById('avatarInitials');
    
    if (profileName) profileName.textContent = AppState.currentUser.name;
    if (profileOrg) profileOrg.textContent = AppState.currentUser.organization;
    if (profileCountry) profileCountry.textContent = AppState.currentUser.country;
    if (avatarInitials) {
        const initials = AppState.currentUser.name.split(' ').map(n => n[0]).join('');
        avatarInitials.textContent = initials;
    }
}

// ========================================
// RESOURCES PAGE
// ========================================
function loadResourcesPage() {
    // Resources are already in HTML, just need to handle filtering
}

function filterResources() {
    const category = document.getElementById('resourceCategory').value;
    const cards = document.querySelectorAll('.resource-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.getAttribute('data-tab') === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// ========================================
// OPPORTUNITIES PAGE
// ========================================
function loadOpportunitiesPage() {
    // Opportunities are already in HTML, just need to handle filtering
}

function filterOpportunities() {
    const category = document.getElementById('opportunityCategory').value;
    const deadline = document.getElementById('opportunityDeadline').value;
    const cards = document.querySelectorAll('.opportunity-card');
    
    cards.forEach(card => {
        let show = true;
        
        // Category filter
        if (category !== 'all' && card.getAttribute('data-category') !== category) {
            show = false;
        }
        
        // Deadline filter (simplified for demo)
        // In a real app, you would parse dates and compare
        
        card.style.display = show ? 'block' : 'none';
    });
}

// ========================================
// EVENTS PAGE & CALENDAR
// ========================================
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function loadEventsPage() {
    renderCalendar();
}

function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentMonthEl = document.getElementById('currentMonth');
    if (currentMonthEl) {
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Check if today
        if (day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            dayCell.classList.add('today');
        }
        
        // Check for events (simplified)
        const hasEvent = AppState.events.some(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                   eventDate.getMonth() === currentMonth &&
                   eventDate.getFullYear() === currentYear;
        });
        
        if (hasEvent) {
            dayCell.classList.add('has-event');
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

function navigateCalendar(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    renderCalendar();
}

function createEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const description = document.getElementById('eventDescription').value;
    
    if (!title || !date || !time || !location || !description) {
        alert('Please fill in all fields');
        return;
    }
    
    const event = {
        id: 'EVT' + String(AppState.events.length + 1).padStart(3, '0'),
        title,
        date,
        time,
        location,
        description
    };
    
    AppState.events.push(event);
    saveDataToStorage();
    
    // Add to audit log
    addAuditLog('event_created', `New event created: ${title}`);
    
    // Reset form
    document.getElementById('createEventForm').reset();
    
    // Close modal
    closeModal('createEventModal');
    
    // Refresh calendar
    renderCalendar();
    
    alert('Event created successfully!');
}

// ========================================
// APPLICATION STATUS PAGE
// ========================================
function loadApplicationStatus() {
    if (!AppState.currentUser || !AppState.currentUser.applicationId) return;
    
    const application = AppState.applications.find(app => app.id === AppState.currentUser.applicationId);
    const statusContainer = document.getElementById('statusContainer');
    
    if (!application || !statusContainer) return;
    
    let statusIcon = '⏳';
    let statusText = 'Pending Review';
    let statusMessage = 'Your application is currently pending review. We will notify you once it has been reviewed.';
    
    if (application.status === 'under_review') {
        statusIcon = '🔍';
        statusText = 'Under Review';
        statusMessage = 'Your application is currently being reviewed by our team. This process typically takes 5-7 business days.';
    } else if (application.status === 'accepted') {
        statusIcon = '✅';
        statusText = 'Accepted';
        statusMessage = 'Congratulations! Your application has been accepted. You are now a member of YAN.';
    } else if (application.status === 'rejected') {
        statusIcon = '❌';
        statusText = 'Not Accepted';
        statusMessage = 'We regret to inform you that your application was not accepted at this time. You may reapply after 6 months.';
    }
    
    statusContainer.innerHTML = `
        <div class="status-icon">${statusIcon}</div>
        <h3>${statusText}</h3>
        <p>${statusMessage}</p>
        <div class="review-section" style="text-align: left; margin-top: 2rem;">
            <h4>Application Details</h4>
            <div class="review-item"><strong>Application ID:</strong> ${application.id}</div>
            <div class="review-item"><strong>Submitted:</strong> ${application.submittedDate}</div>
            <div class="review-item"><strong>Status:</strong> <span class="badge ${application.status}">${application.status.toUpperCase()}</span></div>
        </div>
    `;
}

// ========================================
// PREVIEW CONTENT (LANDING PAGE)
// ========================================
function loadPreviewContent() {
    // Load opportunities preview
    const opportunitiesPreview = document.getElementById('opportunitiesPreview');
    if (opportunitiesPreview) {
        const opportunities = AppState.opportunities.slice(0, 3);
        opportunitiesPreview.innerHTML = opportunities.map(opp => `
            <div class="preview-card">
                <div class="opportunity-badge">${opp.category}</div>
                <h3>${opp.title}</h3>
                <p>${opp.description}</p>
            </div>
        `).join('');
    }
    
    // Load events preview
    const eventsPreview = document.getElementById('eventsPreview');
    if (eventsPreview) {
        const events = AppState.events.slice(0, 3);
        eventsPreview.innerHTML = events.map(event => `
            <div class="preview-card">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div style="margin-top: 1rem; color: var(--text-secondary);">
                    <div>📅 ${new Date(event.date).toLocaleDateString()}</div>
                    <div>📍 ${event.location}</div>
                </div>
            </div>
        `).join('');
    }
}

// ========================================
// MODAL MANAGEMENT
// ========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========================================
// ALERT MANAGEMENT
// ========================================
function showAlert(type, message) {
    alert(message);
}

function showAlertInElement(element, type, message) {
    if (!element) return;
    
    element.className = `alert ${type}`;
    element.textContent = message;
    element.classList.remove('hidden');
    
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}