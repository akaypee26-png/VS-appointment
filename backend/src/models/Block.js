const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blockType: {
    type: String,
    enum: ['full_day', 'time_range'],
    required: true,
  },
  blockDate: {
    type: String, // YYYY-MM-DD format
    required: true,
  },
  startTime: {
    type: String, // HH:MM format (null for full_day)
  },
  endTime: {
    type: String, // HH:MM format (null for full_day)
  },
  reason: {
    type: String,
    required: true,
  },
  affectedAppointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BlockSchema.index({ doctorId: 1, blockDate: 1 });

module.exports = mongoose.model('Block', BlockSchema);
