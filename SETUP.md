# Clinic Appointment Booking System - Setup Guide

Quick start guide to get your clinic appointment system up and running.

## Prerequisites

Before you begin, make sure you have:
- **Node.js** v14+ installed
- **npm** (comes with Node.js)
- **Git** (for cloning)
- **MongoDB Atlas** account (free tier at https://www.mongodb.com/cloud/atlas)
- **Gmail account** (for email notifications)

## Step 1: Project Setup

### Clone/Navigate to Project
```bash
cd clinic-booking-system
```

### Install Dependencies
```bash
npm run install-all
```

This installs dependencies for:
- Root package
- Backend (`/backend`)
- Frontend (`/frontend`)

## Step 2: Configure Backend

### Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free tier cluster
3. Create a database user
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/clinic_booking`)

### Create Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows Computer
3. Generate app password (16 characters)
4. Use this as EMAIL_PASSWORD (not your real Gmail password)

### Setup Backend .env File
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/clinic_booking

# JWT
JWT_SECRET=your-random-secret-key-change-this-in-production
JWT_EXPIRE=24h

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Clinic Configuration
CLINIC_HOURS_START=10
CLINIC_HOURS_END=17
LUNCH_START=13
LUNCH_END=14
APPOINTMENT_DURATION=30
ADVANCE_BOOKING_DAYS=30
CANCELLATION_HOURS=2
```

## Step 3: Configure Frontend

### Setup Frontend .env File
```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 4: Start Development Servers

### Option A: Run Both Concurrently (Recommended)
```bash
cd ..
npm run dev
```

This starts both backend and frontend in one command.

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Test the Application

### Login as Patient
```
Email: patient@test.com
Password: password
```

### Login as Doctor
```
Email: doctor@test.com
Password: password
```

### Demo Flow
1. Open http://localhost:3000
2. Click "Login" → Use patient credentials
3. Click "Book Appointment"
4. Select date (Monday-Friday, next 30 days)
5. Select time slot
6. Confirm booking
7. Check dashboard
8. Try reschedule/cancel

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000 (backend)
netstat -ano | findstr :5000

# Find process on port 3000 (frontend)
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure database name matches in connection string

### Email Not Sending
- Verify Gmail app password (generate new one if needed)
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Ensure SMTP_HOST and SMTP_PORT are correct

### Frontend Can't Reach Backend
- Verify backend is running (`npm run backend`)
- Check REACT_APP_API_URL matches your backend URL
- Verify CORS is enabled in backend

### Port 3000 Already in Use
```bash
# Use different port
PORT=3001 npm run frontend
```

## Development Tips

### Hot Reload
- Backend: Restart server manually (Ctrl+C, then run again)
- Frontend: Automatically reloads on file changes

### Debug Mode
- Add `console.log()` statements in code
- Open browser DevTools (F12) to see frontend logs
- Check terminal output for backend logs

### Database Inspection
- Use MongoDB Atlas dashboard to view data
- Look at Collections → Find relevant documents

## Project Structure Reference

```
backend/
  src/
    app.js              # Express setup
    models/             # Database schemas
    controllers/        # Route handlers
    routes/             # API routes
    services/           # Business logic
    middleware/         # Auth, error handling
    config/             # DB, environment
    
frontend/
  src/
    components/         # React components
    services/          # API calls
    utils/             # Helpers
    context/           # State management
    pages/             # Page components
    App.jsx            # Main routing
    index.jsx          # React entry
```

## Environment Variables Quick Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| MONGODB_URI | Database connection | mongodb+srv://... |
| JWT_SECRET | Secure JWT signing | random-key-123 |
| EMAIL_USER | Sender email | your@gmail.com |
| EMAIL_PASSWORD | Email app password | xxxx xxxx xxxx xxxx |
| REACT_APP_API_URL | Backend API endpoint | http://localhost:5000/api |

## Next Steps

After setup is complete:

1. **Test All Features**
   - Create appointments
   - Reschedule appointments
   - Cancel appointments
   - Update profile
   - Admin blocking features

2. **Review Code**
   - Check backend controllers for business logic
   - Review React components for UI implementation
   - Examine API services for API calls

3. **Customize**
   - Update clinic hours in .env
   - Modify appointment duration
   - Customize email templates
   - Update branding/colors

4. **Deploy**
   - Backend: Deploy to Heroku/Railway/your server
   - Frontend: Deploy to Vercel/Netlify
   - Update API URL in frontend after backend deployment

## Database Seeding

To add demo data to your database, you can use MongoDB Atlas dashboard:

1. Go to MongoDB Atlas
2. Select Collections
3. Create documents manually or use import

Or use a seeding script (create in `backend/seed.js`):
```bash
node backend/seed.js
```

## Getting Help

1. **Check Errors** - Read terminal output carefully
2. **Verify Configuration** - Double-check .env files
3. **Review Logs** - Look at browser console and terminal
4. **Check MongoDB** - Verify data in MongoDB Atlas
5. **Test API** - Use Postman to test endpoints

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set FRONTEND_URL to production URL
- [ ] Update database to production MongoDB cluster
- [ ] Use production SMTP/email service
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Review and update email templates
- [ ] Test all features thoroughly
- [ ] Setup error monitoring
- [ ] Configure backups

---

**Happy coding! 🚀**

For detailed information, see README.md
