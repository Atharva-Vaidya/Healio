# ✅ Healio Demo Checklist

## Pre-Demo Setup (5 minutes)

### Environment Check
- [ ] Node.js installed (`node --version`)
- [ ] Terminal/Command Prompt ready
- [ ] Browser open (Chrome/Firefox/Edge recommended)
- [ ] Internet connection (optional, works offline)

### Server Setup
- [ ] Navigate to project folder
- [ ] Run `node server.js`
- [ ] See "🏥 Healio server running" message
- [ ] Server running on port 3000
- [ ] No error messages in terminal

### Browser Check
- [ ] Open http://localhost:3000
- [ ] Login page loads correctly
- [ ] See Healio logo and gradient background
- [ ] Three credential cards visible
- [ ] No console errors (F12 to check)

### Data Verification
- [ ] `data.json` file created automatically
- [ ] Contains sample users, records, and claims
- [ ] File is readable and properly formatted

---

## Demo Flow Checklist

### Part 1: Hospital Upload (2 minutes)
- [ ] Click "Hospital" credential card
- [ ] Auto-fills email and password
- [ ] Click "Login" button
- [ ] Redirects to hospital.html
- [ ] See "City Hospital" in navbar
- [ ] "Upload Records" tab is active
- [ ] Fill patient form:
  - [ ] Patient ID: EMP001
  - [ ] Patient Name: John Doe
  - [ ] Treatment Type: Consultation
  - [ ] Treatment Details: (any text)
  - [ ] Bill Amount: 3500
  - [ ] File upload (optional)
- [ ] Click "Upload Record"
- [ ] See success alert
- [ ] Switch to "Upload History" tab
- [ ] See newly uploaded record in table
- [ ] Click "Logout"

### Part 2: Employee View & Claim (2 minutes)
- [ ] Click "Employee" credential card
- [ ] Click "Login"
- [ ] See "John Doe" in navbar
- [ ] "Medical Records" tab active by default
- [ ] See timeline with records
- [ ] See hospital-uploaded record
- [ ] Click "My Claims" tab
- [ ] See existing claims with status badges
- [ ] Click "Submit Claim" tab
- [ ] Select a medical record from dropdown
- [ ] Enter claim amount: 3500
- [ ] Enter description
- [ ] Upload bill file (optional)
- [ ] Click "Submit Claim"
- [ ] See success alert
- [ ] Automatically switches to "My Claims" tab
- [ ] See new claim with "PENDING" status
- [ ] Click "Logout"

### Part 3: Corporate Approval (2 minutes)
- [ ] Click "Corporate Admin" credential card
- [ ] Click "Login"
- [ ] See "TechCorp HR" in navbar
- [ ] "Analytics" tab active by default
- [ ] See stat cards with numbers:
  - [ ] Total Claims
  - [ ] Pending Review (should be > 0)
  - [ ] Approved
  - [ ] Rejected
  - [ ] Total Amount
  - [ ] Approved Amount
- [ ] Click "Claims Management" tab
- [ ] See table with all claims
- [ ] See filter buttons (All/Pending/Approved/Rejected)
- [ ] Click "Pending" filter
- [ ] See only pending claims
- [ ] Click "View" on a pending claim
- [ ] Modal opens with claim details
- [ ] Review all information
- [ ] Click "Approve Claim" button
- [ ] See success alert
- [ ] Modal closes
- [ ] Table updates automatically
- [ ] Status badge changes to "APPROVED"
- [ ] Click "Analytics" tab
- [ ] See updated numbers
- [ ] Pending count decreased
- [ ] Approved count increased
- [ ] Click "Logout"

### Part 4: Verification (1 minute)
- [ ] Login as Employee again
- [ ] Go to "My Claims" tab
- [ ] See the approved claim
- [ ] Status badge is green "APPROVED"
- [ ] Demonstrates end-to-end workflow

---

## UI/UX Verification

### Visual Elements
- [ ] Purple gradient background
- [ ] White cards with shadows
- [ ] Clean typography
- [ ] Proper spacing and alignment
- [ ] Icons display correctly (emoji)
- [ ] Buttons have hover effects
- [ ] Status badges color-coded:
  - [ ] Yellow for Pending
  - [ ] Green for Approved
  - [ ] Red for Rejected

### Responsive Design
- [ ] Desktop view (1920x1080) looks good
- [ ] Tablet view (768x1024) adapts properly
- [ ] Mobile view (375x667) is usable
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally if needed

### Interactions
- [ ] Buttons respond to clicks
- [ ] Forms validate required fields
- [ ] Modals open and close properly
- [ ] Tab switching works smoothly
- [ ] Logout redirects to login page
- [ ] Auto-fill credentials work
- [ ] Dropdowns populate correctly

---

## Technical Verification

### Server
- [ ] No errors in terminal
- [ ] API endpoints responding
- [ ] CORS headers working
- [ ] Static files serving correctly
- [ ] JSON data persisting

### Frontend
- [ ] No console errors
- [ ] API calls successful (check Network tab)
- [ ] LocalStorage working (check Application tab)
- [ ] All JavaScript files loading
- [ ] All CSS styles applying

### Data Flow
- [ ] Login creates user session
- [ ] Records save to data.json
- [ ] Claims save to data.json
- [ ] Status updates persist
- [ ] Data survives page refresh
- [ ] Logout clears session

---

## Documentation Check

### Files Present
- [ ] README.md (main documentation)
- [ ] QUICK_START.md (fast reference)
- [ ] DEMO_GUIDE.md (detailed demo script)
- [ ] ARCHITECTURE.md (technical details)
- [ ] FEATURES.md (feature list)
- [ ] PITCH.md (ideathon pitch)
- [ ] CHECKLIST.md (this file)
- [ ] package.json (project metadata)
- [ ] .gitignore (version control)

### Code Files
- [ ] index.html (login page)
- [ ] employee.html (employee dashboard)
- [ ] hospital.html (hospital interface)
- [ ] corporate.html (corporate admin)
- [ ] styles.css (global styles)
- [ ] app.js (common utilities)
- [ ] employee.js (employee logic)
- [ ] hospital.js (hospital logic)
- [ ] corporate.js (corporate logic)
- [ ] server.js (backend server)

---

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Change port in server.js line 6
const PORT = 3001;
```

### Issue: data.json not created
**Solution**: 
```bash
# Delete if exists and restart
del data.json
node server.js
```

### Issue: Login not working
**Solution**: 
- Check server is running
- Check browser console for errors
- Verify credentials are correct
- Clear browser cache

### Issue: Page not loading
**Solution**: 
- Verify URL is http://localhost:3000 (not https)
- Check server terminal for errors
- Try different browser
- Hard refresh (Ctrl+Shift+R)

### Issue: Data not persisting
**Solution**: 
- Check data.json file exists
- Verify file permissions
- Check server has write access
- Restart server

---

## Performance Check

### Speed Tests
- [ ] Server starts in < 1 second
- [ ] Login page loads in < 500ms
- [ ] Dashboard loads in < 500ms
- [ ] API calls respond in < 50ms
- [ ] No lag when switching tabs
- [ ] Smooth animations and transitions

### Resource Usage
- [ ] Total file size < 100KB
- [ ] No memory leaks
- [ ] CPU usage minimal
- [ ] Network requests efficient

---

## Presentation Checklist

### Before Demo
- [ ] Server running and tested
- [ ] Browser window ready
- [ ] Terminal visible (optional)
- [ ] Notes/script prepared
- [ ] Backup plan ready
- [ ] Questions anticipated

### During Demo
- [ ] Speak clearly and confidently
- [ ] Explain each step
- [ ] Highlight key features
- [ ] Show real-time updates
- [ ] Demonstrate all three roles
- [ ] Point out UI/UX details
- [ ] Mention technical highlights
- [ ] Discuss scalability

### After Demo
- [ ] Answer questions
- [ ] Show documentation
- [ ] Discuss roadmap
- [ ] Provide access to code
- [ ] Share GitHub link (if applicable)
- [ ] Collect feedback

---

## Final Verification

### Must-Have Features Working
- [ ] ✅ Role-based login
- [ ] ✅ Hospital record upload
- [ ] ✅ Employee record viewing
- [ ] ✅ Claim submission
- [ ] ✅ Claim approval/rejection
- [ ] ✅ Status updates
- [ ] ✅ Analytics dashboard
- [ ] ✅ Timeline view
- [ ] ✅ Filter functionality

### Nice-to-Have Features Working
- [ ] ✅ Auto-fill credentials
- [ ] ✅ Sample data pre-loaded
- [ ] ✅ Modal dialogs
- [ ] ✅ Responsive design
- [ ] ✅ Status badges
- [ ] ✅ Upload history
- [ ] ✅ Logout functionality

---

## Emergency Backup Plan

### If Server Fails
1. Have screenshots ready
2. Show code walkthrough
3. Explain architecture
4. Discuss features verbally
5. Show documentation

### If Demo Breaks
1. Stay calm
2. Restart server
3. Clear browser cache
4. Use backup browser
5. Continue with presentation

### If Questions Stump You
1. Be honest
2. Explain what you know
3. Discuss how you'd find out
4. Relate to documentation
5. Offer to follow up

---

## Post-Demo Tasks

### Immediate
- [ ] Thank judges/audience
- [ ] Collect feedback
- [ ] Note questions asked
- [ ] Save any issues encountered
- [ ] Backup data.json

### Follow-up
- [ ] Document improvements needed
- [ ] Update README if needed
- [ ] Fix any bugs found
- [ ] Enhance based on feedback
- [ ] Prepare for next round

---

## Success Criteria

### Demo is Successful If:
- ✅ All three roles demonstrated
- ✅ Complete workflow shown
- ✅ No major errors occurred
- ✅ UI looks professional
- ✅ Features work as expected
- ✅ Audience understands value
- ✅ Questions answered well
- ✅ Time limit respected

---

**Ready to Demo? Check all boxes above! 🚀**

**Last Updated**: Before presentation
**Status**: ✅ Ready for Ideathon
