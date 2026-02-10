# 🏗️ Healio Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        HEALIO PLATFORM                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   EMPLOYEE   │      │   HOSPITAL   │      │  CORPORATE   │
│   Dashboard  │      │  Interface   │      │    Admin     │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   REST API      │
                    │   (Node.js)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   data.json     │
                    │   (Storage)     │
                    └─────────────────┘
```

## User Roles & Permissions

### 👤 Employee
**Can:**
- ✅ Upload personal medical records
- ✅ View own medical history
- ✅ Submit insurance claims
- ✅ Track claim status

**Cannot:**
- ❌ View other employees' data
- ❌ Approve/reject claims
- ❌ Access hospital upload interface

### 🏥 Hospital
**Can:**
- ✅ Upload patient records (with employee ID)
- ✅ Add treatment details
- ✅ Attach bills and prescriptions
- ✅ View own upload history

**Cannot:**
- ❌ View or approve claims
- ❌ Access employee personal data
- ❌ Modify existing records

### 💼 Corporate Admin
**Can:**
- ✅ View all submitted claims
- ✅ Approve or reject claims
- ✅ View analytics and reports
- ✅ Filter claims by status

**Cannot:**
- ❌ Upload medical records
- ❌ Submit claims
- ❌ Access detailed medical information

## Data Flow

### 1️⃣ Medical Record Upload Flow

```
Hospital Interface
       │
       ├─ Enter patient details (Employee ID)
       ├─ Add treatment information
       ├─ Upload prescription/bill
       │
       ▼
   POST /api/records
       │
       ├─ Validate employee ID
       ├─ Generate record ID
       ├─ Store in data.json
       │
       ▼
Employee Dashboard
       │
       └─ Record appears in timeline
```

### 2️⃣ Claim Submission Flow

```
Employee Dashboard
       │
       ├─ Select medical record
       ├─ Enter claim amount
       ├─ Add description
       ├─ Upload bill
       │
       ▼
   POST /api/claims
       │
       ├─ Link to medical record
       ├─ Set status = 'pending'
       ├─ Generate claim ID
       ├─ Store in data.json
       │
       ▼
Corporate Dashboard
       │
       └─ Claim appears in pending list
```

### 3️⃣ Claim Approval Flow

```
Corporate Dashboard
       │
       ├─ View claim details
       ├─ Review linked records
       ├─ Click Approve/Reject
       │
       ▼
   PUT /api/claims/:id
       │
       ├─ Update status
       ├─ Add timestamp
       ├─ Save to data.json
       │
       ▼
Employee Dashboard
       │
       └─ Status badge updates
```

## API Endpoints

### Authentication
```
POST /api/login
Body: { email, password }
Response: { success, user: { id, name, role, employeeId } }
```

### Medical Records
```
GET /api/records
Response: [ { id, employeeId, type, description, ... } ]

POST /api/records
Body: { employeeId, type, description, billAmount, ... }
Response: { id, createdAt, ... }
```

### Claims
```
GET /api/claims
Response: [ { id, employeeId, amount, status, ... } ]

POST /api/claims
Body: { employeeId, recordId, amount, description, ... }
Response: { id, status: 'pending', submittedAt, ... }

PUT /api/claims/:id
Body: { status: 'approved' | 'rejected' }
Response: { id, status, updatedAt, ... }
```

## Data Models

### User
```javascript
{
  id: number,
  email: string,
  password: string,
  role: 'employee' | 'hospital' | 'corporate',
  name: string,
  employeeId?: string  // Only for employees
}
```

### Medical Record
```javascript
{
  id: number,
  employeeId: string,
  employeeName: string,
  type: 'prescription' | 'lab-report' | 'discharge-summary' | 'consultation',
  description: string,
  treatmentDetails?: string,
  billAmount?: number,
  fileName: string,
  hospitalName?: string,
  createdAt: ISO8601 timestamp
}
```

### Claim
```javascript
{
  id: number,
  employeeId: string,
  employeeName: string,
  recordId: number,
  amount: number,
  description: string,
  billFileName: string,
  recordType: string,
  status: 'pending' | 'approved' | 'rejected',
  submittedAt: ISO8601 timestamp,
  updatedAt?: ISO8601 timestamp
}
```

## File Structure

```
healio/
│
├── Frontend (Static Files)
│   ├── index.html          # Login page
│   ├── employee.html       # Employee dashboard
│   ├── hospital.html       # Hospital interface
│   ├── corporate.html      # Corporate admin panel
│   ├── styles.css          # Global styles
│   ├── app.js             # Common utilities & API calls
│   ├── employee.js        # Employee-specific logic
│   ├── hospital.js        # Hospital-specific logic
│   └── corporate.js       # Corporate-specific logic
│
├── Backend
│   └── server.js          # Node.js HTTP server + API
│
├── Data
│   └── data.json          # Auto-generated data store
│
└── Documentation
    ├── README.md          # Main documentation
    ├── DEMO_GUIDE.md      # Demo script
    └── ARCHITECTURE.md    # This file
```

## Security Considerations (Production)

### Current MVP (Demo Only)
- ❌ Plain text passwords
- ❌ No session management
- ❌ No HTTPS
- ❌ No input validation
- ❌ No rate limiting

### Production Requirements
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ HTTPS/TLS encryption
- ✅ Input sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ HIPAA compliance

## Scalability Path

### Phase 1: MVP (Current)
- Single server
- JSON file storage
- 10-50 users
- Demo/prototype

### Phase 2: Production
- PostgreSQL/MongoDB
- Redis caching
- JWT sessions
- 1,000+ users

### Phase 3: Enterprise
- Microservices architecture
- Load balancing
- Database replication
- CDN for static assets
- 100,000+ users

### Phase 4: Cloud Scale
- Kubernetes orchestration
- Multi-region deployment
- Auto-scaling
- Real-time analytics
- Unlimited users

## Technology Choices

### Why Node.js?
- ✅ Fast development
- ✅ JavaScript everywhere
- ✅ Built-in HTTP module
- ✅ No dependencies needed
- ✅ Easy to understand

### Why JSON Storage?
- ✅ Zero setup
- ✅ Human-readable
- ✅ Perfect for demos
- ✅ Easy to inspect/debug
- ✅ No database installation

### Why Vanilla JavaScript?
- ✅ No build process
- ✅ Instant load time
- ✅ Easy to modify
- ✅ No framework learning curve
- ✅ Maximum compatibility

## Performance Metrics

### Current MVP
- Server start: < 1 second
- Page load: < 500ms
- API response: < 50ms
- File size: < 100KB total

### Production Targets
- API response: < 200ms
- Page load: < 2 seconds
- 99.9% uptime
- Support 1000 concurrent users

---

**This architecture prioritizes simplicity and demonstrability over production-grade complexity.**
