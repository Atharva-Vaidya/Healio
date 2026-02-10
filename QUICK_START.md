# ⚡ Quick Start Guide

## 🚀 Start in 10 Seconds

```bash
node server.js
```

Open: **http://localhost:3000**

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👤 Employee | employee@company.com | demo123 |
| 🏥 Hospital | hospital@medical.com | demo123 |
| 💼 Corporate | corporate@company.com | demo123 |

**Tip:** Click on credential cards on login page to auto-fill!

---

## 📋 Quick Test Workflow

### 1. Hospital Upload (30 sec)
- Login as Hospital
- Patient ID: `EMP001`
- Name: `John Doe`
- Treatment: Any type
- Amount: Any number
- Click Upload

### 2. Employee Claim (30 sec)
- Login as Employee
- Go to "Submit Claim"
- Select any record
- Enter amount
- Click Submit

### 3. Corporate Approve (30 sec)
- Login as Corporate
- View Analytics
- Go to "Claims Management"
- Click "View" on pending claim
- Click "Approve"

### 4. Verify (10 sec)
- Login as Employee again
- Check "My Claims"
- See approved status ✅

---

## 🎯 Key Features to Demo

✅ **Role-based dashboards** - Each user sees only what they need
✅ **Real-time updates** - Status changes reflect immediately
✅ **Timeline view** - Medical history in chronological order
✅ **Analytics** - Corporate sees metrics at a glance
✅ **One-click actions** - Approve/reject with single button
✅ **Status badges** - Color-coded for quick scanning
✅ **Sample data** - Pre-loaded for instant demo

---

## 🎨 UI Highlights

- **Purple gradient** background
- **White cards** with shadows
- **Color-coded badges**: 🟡 Pending | 🟢 Approved | 🔴 Rejected
- **Responsive** design
- **Clean typography**
- **Smooth transitions**

---

## 📊 Pre-loaded Data

- ✅ 2 Medical records
- ✅ 1 Approved claim
- ✅ 1 Pending claim
- ✅ 3 User accounts

---

## 🔧 Troubleshooting

**Server won't start?**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process or change port in server.js
```

**Need fresh data?**
```bash
del data.json
node server.js
```

**Page not loading?**
- Check server is running
- Try http://localhost:3000 (not https)
- Clear browser cache (Ctrl+Shift+R)

---

## 📱 Mobile Testing

The platform is fully responsive! Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

---

## 🎤 30-Second Pitch

"Healio connects employees, hospitals, and corporate HR in one platform. Hospitals upload records, employees submit claims, and admins approve with one click. Real-time updates, complete transparency, zero complexity."

---

## 📞 Support

**Issues?** Check:
1. Node.js installed? `node --version`
2. Server running? Check terminal
3. Correct URL? http://localhost:3000
4. Browser console? F12 for errors

---

## 🎓 Learning Resources

- **README.md** - Full documentation
- **DEMO_GUIDE.md** - Detailed demo script
- **ARCHITECTURE.md** - Technical details

---

**Ready to impress? Let's go! 🚀**
