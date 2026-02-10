// Common utilities and demo authentication
const API_URL = 'http://localhost:3000/api'; // Legacy - not used in static mode

// Demo user credentials (hardcoded for static deployment)
const DEMO_USERS = [
    {
        id: 1,
        email: 'employee@healio.com',
        password: 'demo123',
        role: 'employee',
        name: 'John Doe',
        employeeId: 'EMP001'
    },
    {
        id: 2,
        email: 'hospital@healio.com',
        password: 'demo123',
        role: 'hospital',
        name: 'City Hospital'
    },
    {
        id: 3,
        email: 'admin@healio.com',
        password: 'demo123',
        role: 'corporate',
        name: 'TechCorp HR'
    }
];

// Demo data storage keys
const STORAGE_KEYS = {
    USER: 'healioUser',
    RECORDS: 'healioRecords',
    CLAIMS: 'healioClaims'
};

// Initialize demo data if not exists
function initializeDemoData() {
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
        const demoRecords = [
            {
                id: 1704067200000,
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                type: 'consultation',
                description: 'Annual health checkup',
                treatmentDetails: 'Routine physical examination, blood pressure check, basic blood tests',
                billAmount: 2500,
                fileName: 'checkup_report.pdf',
                hospitalName: 'City Hospital',
                createdAt: '2024-01-01T10:00:00.000Z'
            },
            {
                id: 1706745600000,
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                type: 'lab-report',
                description: 'Blood test results',
                treatmentDetails: 'Complete blood count, lipid profile, blood sugar levels',
                billAmount: 1800,
                fileName: 'lab_results.pdf',
                hospitalName: 'City Hospital',
                createdAt: '2024-02-01T14:30:00.000Z'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(demoRecords));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
        const demoClaims = [
            {
                id: 1707350400000,
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                recordId: 1704067200000,
                amount: 2500,
                description: 'Reimbursement for annual health checkup',
                billFileName: 'invoice_001.pdf',
                recordType: 'consultation',
                hospitalName: 'City Hospital',
                treatmentDetails: 'Routine physical examination, blood pressure check, basic blood tests',
                status: 'approved',
                submittedAt: '2024-02-08T09:00:00.000Z',
                updatedAt: '2024-02-09T11:00:00.000Z'
            },
            {
                id: 1708560000000,
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                recordId: 1706745600000,
                amount: 1800,
                description: 'Lab test reimbursement claim',
                billFileName: 'lab_invoice.pdf',
                recordType: 'lab-report',
                hospitalName: 'City Hospital',
                treatmentDetails: 'Complete blood count, lipid profile, blood sugar levels',
                status: 'submitted',
                submittedAt: '2024-02-22T10:30:00.000Z'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(demoClaims));
    }
}

// Client-side login function
function loginUser(email, password) {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user session
        const userSession = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            employeeId: user.employeeId,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userSession));
        
        // Initialize demo data
        initializeDemoData();
        
        return { success: true, user: userSession };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

// Store current user
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(userJson);
}

// Logout function
function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = 'index.html';
}

// Fill credentials on login page
function fillCredentials(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
}

// Login form handler (client-side)
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('loginError');
        
        // Clear previous error
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
        
        // Validate inputs
        if (!email || !password) {
            if (errorMsg) {
                errorMsg.textContent = 'Please enter both email and password';
                errorMsg.style.display = 'block';
            }
            return;
        }
        
        // Attempt login
        const result = loginUser(email, password);
        
        if (result.success) {
            // Redirect based on role
            switch(result.user.role) {
                case 'employee':
                    window.location.href = 'employee.html';
                    break;
                case 'hospital':
                    window.location.href = 'hospital.html';
                    break;
                case 'corporate':
                    window.location.href = 'corporate.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        } else {
            if (errorMsg) {
                errorMsg.textContent = result.message;
                errorMsg.style.display = 'block';
            }
        }
    });
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format currency
function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
}

// Get status badge HTML
function getStatusBadge(status) {
    return `<span class="status-badge ${status}">${status.toUpperCase()}</span>`;
}

// Client-side API helper functions (using localStorage)
async function apiGet(endpoint) {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint === '/records') {
        const records = localStorage.getItem(STORAGE_KEYS.RECORDS);
        return records ? JSON.parse(records) : [];
    }
    
    if (endpoint === '/claims') {
        const claims = localStorage.getItem(STORAGE_KEYS.CLAIMS);
        return claims ? JSON.parse(claims) : [];
    }
    
    return [];
}

async function apiPost(endpoint, data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint === '/records') {
        const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]');
        data.id = Date.now();
        data.createdAt = new Date().toISOString();
        records.push(data);
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
        return data;
    }
    
    if (endpoint === '/claims') {
        const claims = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMS) || '[]');
        
        // Check for duplicate claim
        const normalizedRecordId = Number(data.recordId);
        const existingClaim = claims.find(c => {
            const normalizedClaimRecordId = Number(c.recordId);
            const blockingStatuses = ['submitted', 'approved'];
            return normalizedClaimRecordId === normalizedRecordId && blockingStatuses.includes(c.status);
        });
        
        if (existingClaim) {
            throw new Error(`A ${existingClaim.status} claim already exists for this medical record.`);
        }
        
        data.id = Date.now();
        data.status = 'submitted';
        data.submittedAt = new Date().toISOString();
        data.recordId = normalizedRecordId;
        claims.push(data);
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
        return data;
    }
    
    return data;
}

async function apiPut(endpoint, data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (endpoint.startsWith('/claims/')) {
        const claimId = parseInt(endpoint.split('/')[2]);
        const claims = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMS) || '[]');
        const claim = claims.find(c => c.id === claimId);
        
        if (claim) {
            claim.status = data.status;
            claim.updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
            return claim;
        }
    }
    
    return null;
}
