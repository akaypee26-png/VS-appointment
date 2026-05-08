# Clinic Appointment Booking System

A production-ready, full-stack clinic appointment booking web application built with Node.js, Express, MongoDB, and React. Perfect for a single-doctor clinic that wants to manage appointments professionally.

## ✨ Features

### Patient Features
- **User Registration & Authentication** - Secure JWT-based authentication with password hashing
- **Appointment Booking** - 3-step guided booking wizard with real-time slot availability
- **View Appointments** - Filter by status (upcoming, completed, cancelled)
- **Reschedule Appointments** - Change appointment date/time (if >2 hours away)
- **Cancel Appointments** - With reason (if >2 hours away)
- **Edit Profile** - Update name, phone, email
- **Change Password** - Secure password management
- **Delete Account** - Soft delete with automatic future appointment cancellation
- **Email Notifications** - Instant confirmations, cancellations, and reschedules

### Doctor/Admin Features
- **Admin Dashboard** - Statistics and quick actions
- **View All Appointments** - With advanced filtering by status and date
- **Manage Appointments** - Reschedule, cancel, mark complete (no 2-hour restriction)
- **Block Full Day** - Emergency day blockout with auto-cancellation
- **Block Time Range** - Block specific hours with auto-cancellation
- **Automatic Notifications** - Patients are notified of blocks and cancellations
- **Appointment Statistics** - Monitor total, upcoming, completed, cancelled

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (24h expiry)
- **Password**: bcryptjs (10 rounds)
- **Email**: Nodemailer with professional HTML templates
- **Validation**: express-validator

### Frontend Stack
- **Framework**: React 18 with functional components & hooks
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS (responsive)
- **Form Validation**: Client-side validation utilities

### Clinic Configuration
- **Hours**: 10:00 AM - 5:00 PM IST
- **Lunch Break**: 1:00 PM - 2:00 PM (no slots)
- **Slot Duration**: 30 minutes
- **Available Slots**: 11 per day (4 morning + 7 afternoon)
- **Working Days**: Monday - Friday only
- **Booking Window**: Up to 30 days in advance
- **Cancellation Window**: Up to 2 hours before appointment
- **Timezone**: IST (India Standard Time)

## 📁 Project Structure

```
clinic-booking-system/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB schemas (User, Appointment, Block)
│   │   ├── controllers/    # Route handlers (auth, appointment, admin, profile)
│   │   ├── routes/         # Express route definitions
│   │   ├── middleware/     # Auth & error handling
│   │   ├── services/       # Business logic (slots, email)
│   │   ├── config/         # DB & environment config
│   │   └── app.js          # Express app setup
│   ├── package.json
│   ├── .env.example        # Environment template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components by feature
│   │   │   ├── Auth/       # Login, Register
│   │   │   ├── Dashboard/  # Patient dashboard
│   │   │   ├── Booking/    # Booking flow, reschedule
│   │   │   ├── Admin/      # Admin dashboard, appointments
│   │   │   ├── Profile/    # Profile management
│   │   │   └── Common/     # Reusable UI components
│   │   ├── services/       # API service calls
│   │   ├── utils/          # Helpers (date, validation)
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main routing
│   │   ├── index.jsx       # React entry
│   │   └── index.css       # Tailwind setup
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── package.json            # Root npm scripts
├── README.md              # This file
├── SETUP.md               # Setup instructions
├── .gitignore
└── IMPLEMENTATION_SUMMARY.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- MongoDB Atlas account (free tier OK)
- Email service account (Gmail with app password)

### Installation

1. **Clone & Navigate**
   ```bash
   cd clinic-booking-system
   ```

2. **Install All Dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure Environment**

   Backend (backend/.env):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clinic_booking
   JWT_SECRET=your_random_secret_key
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   ```

   Frontend (frontend/.env):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

   Or separately:
   ```bash
   npm run backend  # Terminal 1, port 5000
   npm run frontend # Terminal 2, port 3000
   ```

## 💾 Database Models

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: 'patient' | 'doctor' | 'admin',
  isDeleted: Boolean,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Collection
```javascript
{
  patientId: ObjectId,
  patientName: String,
  patientEmail: String,
  doctorId: ObjectId,
  appointmentDate: String (YYYY-MM-DD),
  appointmentDateTime: Date,
  startTime: String (HH:MM),
  endTime: String (HH:MM),
  reasonForVisit: String,
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled',
  cancelledBy: String,
  cancellationReason: String,
  previousAppointmentId: ObjectId,
  createdAt: Date
}
```

### Block Collection
```javascript
{
  doctorId: ObjectId,
  blockType: 'full_day' | 'time_range',
  blockDate: String (YYYY-MM-DD),
  startTime: String (HH:MM, null for full_day),
  endTime: String (HH:MM, null for full_day),
  reason: String,
  affectedAppointments: [ObjectId],
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - New user registration
- `POST /login` - User login (returns JWT)
- `POST /logout` - Session logout

### Appointments (`/api/appointments`) - Protected
- `GET /available-slots?date=YYYY-MM-DD` - Get available slots for date
- `POST /book` - Book new appointment
- `GET /my-appointments?status=upcoming` - Patient's appointments
- `GET /:id` - Appointment details
- `PATCH /:id/cancel` - Cancel appointment (patient only)
- `PATCH /:id/reschedule` - Reschedule appointment (patient only)

### Admin (`/api/admin`) - Admin Only
- `GET /appointments` - All appointments (with filters)
- `GET /appointments/:id` - Appointment details
- `PATCH /appointments/:id/reschedule` - Reschedule (no 2-hour limit)
- `PATCH /appointments/:id/cancel` - Cancel (no 2-hour limit)
- `PATCH /appointments/:id/complete` - Mark as completed
- `POST /block-day` - Block entire day
- `POST /block-time-range` - Block time range
- `GET /blocked-dates` - View all blocks

### Profile (`/api/profile`) - Protected
- `GET /` - User profile
- `PATCH /` - Update name/phone
- `PATCH /change-password` - Change password
- `DELETE /` - Delete account (soft delete)

## 🧪 Test Credentials

### Patient
```
Email: patient@test.com
Password: password
```

### Doctor/Admin
```
Email: doctor@test.com
Password: password
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT authentication (24h expiry)
- ✅ Backend validation for all operations
- ✅ CORS enabled for frontend-only access
- ✅ Protected routes with middleware
- ✅ Soft delete for data preservation
- ✅ Secure password change flow
- ✅ Automatic 401 redirect on token expiry
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection (React escaping)

## 📧 Email Notifications

The system sends professional HTML emails for:

1. **Appointment Confirmation**
   - Full appointment details
   - Clinic address and phone
   - Arrival instructions

2. **Appointment Cancellation**
   - Cancellation reason
   - Option to rebook
   - Contact information

3. **Appointment Reschedule**
   - Old vs new appointment comparison
   - Clear formatting

4. **Emergency Blocks**
   - Block notification to affected patients
   - Automatic appointment cancellation

## 🎨 UI/UX Highlights

- **Responsive Design** - Works perfectly on mobile, tablet, desktop
- **Beautiful Gradients** - Modern, professional appearance
- **Intuitive Flow** - 3-step booking wizard with progress indicator
- **Real-time Validation** - Instant feedback on form inputs
- **Status Badges** - Color-coded appointment statuses
- **Loading States** - User feedback during async operations
- **Modal Dialogs** - Confirmation for critical actions
- **Tab Interface** - Organized profile management
- **Responsive Tables** - Admin appointment management

## 🔄 Appointment Status Flow

```
New → Booking → Upcoming → [Reschedule] → Rescheduled → Upcoming → Completed/Cancelled
                    ↓
                 Cancelled (within 2 hours)
                    ↓
                 System Auto-Cancelled (block/delete)
```

## ⚙️ Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT signing | your-secret-key |
| PORT | Backend port | 5000 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| EMAIL_USER | Email sender address | your-email@gmail.com |
| EMAIL_PASSWORD | Email app password | your-password |
| SMTP_HOST | SMTP server | smtp.gmail.com |
| SMTP_PORT | SMTP port | 587 |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## 📱 Demo Walkthrough

1. **Patient Registration** - Register as a new patient
2. **Login** - Login with credentials
3. **Book Appointment** - Select date → time → confirm
4. **View Dashboard** - See all your appointments
5. **Reschedule** - Change appointment date/time
6. **Cancel** - Cancel appointment (if >2 hours away)
7. **Profile** - Update information or delete account

8. **Admin Login** - Login as doctor
9. **Admin Dashboard** - View statistics
10. **Manage Appointments** - Reschedule, cancel, mark complete
11. **Emergency Block** - Block full day or time range
12. **View Blocks** - See all blocked dates

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set `REACT_APP_API_URL` environment variable
3. Deploy automatically on push

### Backend (Heroku/Railway)
1. Connect GitHub repo to hosting platform
2. Set all environment variables
3. Deploy with `npm start` command

### Database (MongoDB Atlas)
- Already cloud-hosted, just configure connection string

## 📊 Performance Optimizations

- Database indexes on frequently queried fields
- JWT for stateless authentication
- CORS optimization
- Lazy loading ready components
- Efficient MongoDB queries

## 🔧 Troubleshooting

**Email not sending?**
- Check Gmail app password (not regular password)
- Enable "Less secure app access" or use app-specific password
- Verify SMTP settings

**MongoDB connection fails?**
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure database name is correct

**Frontend can't reach backend?**
- Confirm backend is running on port 5000
- Check CORS URL matches frontend URL
- Verify REACT_APP_API_URL is set correctly

## 📖 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 License

MIT License - feel free to use for any purpose

## 🤝 Support

For issues or questions, please check the SETUP.md guide or review the codebase comments.

---

**Built with ❤️ for healthcare professionals**
