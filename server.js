const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const DATA_FILE = 'data.json';

// Initialize data file with sample data
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        users: [
            { id: 1, email: 'corporate@company.com', password: 'demo123', role: 'corporate', name: 'TechCorp HR' },
            { id: 2, email: 'employee@company.com', password: 'demo123', role: 'employee', name: 'John Doe', employeeId: 'EMP001' },
            { id: 3, email: 'hospital@medical.com', password: 'demo123', role: 'hospital', name: 'City Hospital' }
        ],
        records: [
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
        ],
        claims: [
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
        ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static files
    if (pathname === '/' || pathname.endsWith('.html') || pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.md')) {
        let filePath = pathname === '/' ? '/home.html' : pathname;
        filePath = path.join(__dirname, filePath);
        
        const extname = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.md': 'text/markdown'
        };
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': contentTypes[extname] || 'text/plain' });
                res.end(content);
            }
        });
        return;
    }

    // API Routes
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const data = readData();

        // Login
        if (pathname === '/api/login' && req.method === 'POST') {
            const { email, password } = JSON.parse(body);
            const user = data.users.find(u => u.email === email && u.password === password);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, user: { ...user, password: undefined } }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
            }
        }
        
        // Get records
        else if (pathname === '/api/records' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data.records));
        }
        
        // Add record (Hospital)
        else if (pathname === '/api/records' && req.method === 'POST') {
            const record = JSON.parse(body);
            record.id = Date.now();
            record.createdAt = new Date().toISOString();
            data.records.push(record);
            writeData(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(record));
        }
        
        // Get claims
        else if (pathname === '/api/claims' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data.claims));
        }
        
        // Submit claim (Employee)
        else if (pathname === '/api/claims' && req.method === 'POST') {
            const claim = JSON.parse(body);
            
            // Normalize recordId for comparison
            const normalizedRecordId = Number(claim.recordId);
            
            // Check for duplicate claim - only block if status is submitted or approved
            const existingClaim = data.claims.find(c => {
                const normalizedClaimRecordId = Number(c.recordId);
                const blockingStatuses = ['submitted', 'approved'];
                return normalizedClaimRecordId === normalizedRecordId && blockingStatuses.includes(c.status);
            });
            
            if (existingClaim) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Duplicate claim detected',
                    message: `A ${existingClaim.status} claim already exists for this medical record.` 
                }));
                return;
            }
            
            // Create new claim
            claim.id = Date.now();
            claim.status = 'submitted';
            claim.submittedAt = new Date().toISOString();
            claim.recordId = normalizedRecordId; // Ensure normalized ID is stored
            data.claims.push(claim);
            writeData(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(claim));
        }
        
        // Update claim status (Corporate)
        else if (pathname.startsWith('/api/claims/') && req.method === 'PUT') {
            const claimId = parseInt(pathname.split('/')[3]);
            const { status } = JSON.parse(body);
            const claim = data.claims.find(c => c.id === claimId);
            if (claim) {
                claim.status = status;
                claim.updatedAt = new Date().toISOString();
                writeData(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(claim));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Claim not found' }));
            }
        }
        
        else {
            res.writeHead(404);
            res.end('Not found');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🏥 Healio server running at http://localhost:${PORT}`);
    console.log(`📊 Demo credentials in README.md`);
});
