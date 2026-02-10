# 🏥 Healio - Healthcare Records & Claims Platform

## Overview
Healio is a lightweight, demo-ready web platform that demonstrates how corporates, employees, and hospitals can interact seamlessly for medical record storage and insurance claim processing. Built for ideathon presentation with focus on workflow clarity and usability.

## ✨ Key Features

### 👤 Employee Portal
- Upload medical records (prescriptions, lab reports, discharge summaries)
- View medical history in timeline format
- Submit insurance claims **linked to hospital-verified records**
- Track claim status in real-time (Submitted/Approved/Rejected)
- **Fraud Prevention**: Claims auto-filled from hospital bills (read-only amounts)

### 🏥 Hospital Interface
- Search and select employees by ID
- Upload treatment details and prescriptions
- Attach bills and medical documents
- View upload history with complete audit trail
- **Verified Records**: Hospital-uploaded bills become basis for claims

### 💼 Corporate Admin Dashboard
- View all submitted claims in organized table
- Filter claims by status (All/Submitted/Approved/Rejected)
- Approve or reject claims with one click
- View analytics: total claims, amounts, approval rates
- Detailed claim review with **hospital verification badge**
- **Fraud Detection**: See complete treatment details and bill linkage

## 🚀 Quick Start

### For Local Development
```bash
# Option 1: Use Node.js server (optional)
node server.js
```

### For Static Deployment (Vercel, Netlify, GitHub Pages)
No server needed! Just deploy the HTML files directly.

The platform now works completely client-side using:
- LocalStorage for data persistence
- Client-side authentication
- Demo user credentials

Then open your browser to: **http://localhost:3000** (with server) or open `home.html` directly (static)

You'll see the Healio landing page with:
- Clear value proposition
- Problem → Solution comparison
- Key features overview
- Connected ecosystem visualization
- Live dashboard preview
- Quick access to all user portals

### 🔐 Demo Credentials (Static Mode)

| Role | Email | Password |
|------|-------|----------|
| **Employee** | employee@healio.com | demo123 |
| **Hospital** | hospital@healio.com | demo123 |
| **Corporate Admin** | admin@healio.com | demo123 |

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Employee** | employee@healio.com | demo123 |
| **Hospital** | hospital@healio.com | demo123 |
| **Corporate Admin** | admin@healio.com | demo123 |

**Note**: The platform now works in static mode (no backend required) using localStorage for data persistence. Perfect for Vercel, Netlify, or GitHub Pages deployment!

## 📊 Demo Workflow

1. **Hospital uploads patient record**
   - Login as Hospital
   - Enter patient details (Employee ID: EMP001)
   - Upload treatment details and bill amount
   - Record appears in employee's history

2. **Employee views and submits claim**
   - Login as Employee
   - View medical records in timeline
   - Select hospital treatment record from dropdown
   - **Amount auto-fills from hospital bill (read-only)**
   - **System prevents duplicate claims**
   - Submit claim for review

3. **Corporate reviews and processes**
   - Login as Corporate Admin
   - View analytics dashboard
   - Review claim with **hospital verification badge**
   - See complete treatment details and bill linkage
   - Approve or reject with one click
   - Employee sees updated status immediately

## 🛡️ Fraud Prevention Features

### Simple Yet Effective
- ✅ **Hospital-Verified Records**: Claims must link to hospital-uploaded records
- ✅ **Read-Only Amounts**: Claim amounts auto-filled from hospital bills
- ✅ **Duplicate Detection**: System blocks multiple claims for same treatment
- ✅ **Audit Trail**: Complete traceability from hospital to approval
- ✅ **No Manual Bills**: Employees cannot upload arbitrary invoices

### How It Works
1. Hospital uploads treatment with verified bill amount
2. Employee selects treatment from dropdown (only unclaimed records shown)
3. Amount auto-fills and cannot be edited
4. System checks for duplicate claims before submission
5. Corporate sees hospital verification in review

**Result**: Eliminates inflated claims, fake bills, and duplicate submissions without complex AI or heavy security layers.

See [FRAUD_PREVENTION.md](FRAUD_PREVENTION.md) for detailed explanation.

## 🎨 UI Highlights
- Clean, modern gradient design
- Color-coded status badges (Pending/Approved/Rejected)
- Responsive layout for all screen sizes
- Interactive timeline for medical history
- Real-time data updates
- Modal dialogs for detailed views

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: Node.js with built-in HTTP module
- **Database**: JSON file storage (data.json)
- **No external dependencies** - runs immediately

### Data Structure
```javascript
{
  users: [{ id, email, password, role, name, employeeId }],
  records: [{ id, employeeId, type, description, billAmount, hospitalName, createdAt }],
  claims: [{ id, employeeId, recordId, amount, status, submittedAt, updatedAt }]
}
```

## 📁 Project Structure
```
healio/
├── home.html               # Landing page (default)
├── home-styles.css         # Landing page styles
├── home.js                 # Landing page interactions
├── index.html              # Login page
├── employee.html           # Employee dashboard
├── hospital.html           # Hospital interface
├── corporate.html          # Corporate admin panel
├── styles.css              # Dashboard styles
├── app.js                  # Common utilities
├── employee.js             # Employee logic
├── hospital.js             # Hospital logic
├── corporate.js            # Corporate logic
├── server.js               # Backend API server
├── data.json               # Auto-generated data store
├── README.md               # Main documentation
├── HOME_PAGE_GUIDE.md      # Landing page documentation
├── FRAUD_PREVENTION.md     # Anti-fraud features explained
├── QUICK_START.md          # Fast reference
├── DEMO_GUIDE.md           # Demo script
├── ARCHITECTURE.md         # Technical details
├── FEATURES.md             # Feature list
├── PITCH.md                # Ideathon pitch
├── CHECKLIST.md            # Pre-demo verification
└── PROJECT_SUMMARY.md      # Complete overview
```

## 🎯 Ideathon-Ready Features
- ✅ Pre-loaded sample data for instant demo
- ✅ One-click credential filling on login
- ✅ Complete end-to-end workflow
- ✅ **Fraud prevention through hospital-verified records**
- ✅ **Duplicate claim detection**
- ✅ **Read-only claim amounts**
- ✅ Visual status indicators
- ✅ Clean, professional UI
- ✅ No complex setup or dependencies
- ✅ Works offline after initial load
- ✅ Mobile-responsive design

## 🔄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | User authentication |
| GET | /api/records | Get all medical records |
| POST | /api/records | Upload new record |
| GET | /api/claims | Get all claims |
| POST | /api/claims | Submit new claim |
| PUT | /api/claims/:id | Update claim status |

## 💡 Future Enhancements (Not in MVP)
- Real payment gateway integration
- Insurance API connections
- Document OCR and parsing
- Email notifications
- Advanced analytics and reporting
- Multi-company support
- Compliance and audit logs

## 📝 Notes
- This is a prototype for demonstration purposes
- No production-grade security implemented
- File uploads are simulated (filenames stored only)
- Data persists in data.json file
- Suitable for ideathon judging and concept validation

## 🎓 Use Cases
- Corporate health insurance management
- Employee medical record storage
- Hospital billing and claims
- Insurance claim processing workflow
- Healthcare ecosystem demonstration

---

**Built for ideathon presentation** - Minimal complexity, maximum clarity ✨
