const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  appointmentDate: {
    type: String, // YYYY-MM-DD format
    required: true,
  },
  appointmentDateTime: {
    type: Date, // Full datetime for easy querying
    required: true,
    index: true,
  },
  startTime: {
    type: String, // HH:MM format
    required: true,
  },
  endTime: {
    type: String, // HH:MM format
    required: true,
  },
  reasonForVisit: {
    type: String,
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
    default: 'upcoming',
    index: true,
  },
  cancelledBy: {
    type: String, // 'patient', 'doctor', 'system'
    default: null,
  },
  cancellationReason: {
    type: String,
  },
  previousAppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for efficient queries
AppointmentSchema.index({ patientId: 1, appointmentDate: 1 });
AppointmentSchema.index({ appointmentDate: 1, status: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
