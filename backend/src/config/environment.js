require('dotenv').config();

module.exports = {
  mongodb_uri: process.env.MONGODB_URI,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire: process.env.JWT_EXPIRE || '24h',
  port: process.env.PORT || 5000,
  frontend_url: process.env.FRONTEND_URL,
  email_user: process.env.EMAIL_USER,
  email_password: process.env.EMAIL_PASSWORD,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  clinic_hours_start: parseInt(process.env.CLINIC_HOURS_START) || 10,
  clinic_hours_end: parseInt(process.env.CLINIC_HOURS_END) || 17,
  lunch_start: parseInt(process.env.LUNCH_START) || 13,
  lunch_end: parseInt(process.env.LUNCH_END) || 14,
  appointment_duration: parseInt(process.env.APPOINTMENT_DURATION) || 30,
  advance_booking_days: parseInt(process.env.ADVANCE_BOOKING_DAYS) || 30,
  cancellation_hours: parseInt(process.env.CANCELLATION_HOURS) || 2,
};
