const Appointment = require('../models/Appointment');
const slotService = require('../services/slotService');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.user._id; // Assuming single doctor

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const result = await slotService.getAvailableSlots(date, doctorId);

    res.status(200).json({ success: true, slots: result.slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { appointmentDate, startTime, reasonForVisit } = req.body;
    const patientId = req.user._id;

    // Validate slot availability
    const availableSlots = await slotService.getAvailableSlots(appointmentDate, null);
    const isSlotAvailable = availableSlots.slots?.some((slot) => slot.startTime === startTime);

    if (!isSlotAvailable) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }

    // Check for double booking
    const existing = await Appointment.findOne({
      patientId,
      appointmentDate,
      status: { $in: ['upcoming', 'rescheduled'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an appointment on this date' });
    }

    // Calculate end time
    const slotDuration = 30; // minutes
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = (hours * 60 + minutes) + slotDuration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    // Create appointment
    const appointment = new Appointment({
      patientId,
      patientName: req.user.name,
      patientEmail: req.user.email,
      patientPhone: req.user.phone,
      doctorId: null, // Will be set to actual doctor when system has multiple doctors
      appointmentDate,
      appointmentDateTime: slotService.generateAppointmentDateTime(appointmentDate, startTime),
      startTime,
      endTime,
      reasonForVisit,
      status: 'upcoming',
    });

    await appointment.save();

    // Send confirmation email
    await emailService.sendAppointmentConfirmation(req.user, appointment);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const patientId = req.user._id;

    let query = { patientId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query).sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: id,
      patientId,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const patientId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: id,
      patientId,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Can only cancel upcoming appointments' });
    }

    // Check 2-hour rule
    if (slotService.isWithinTwoHours(appointment.appointmentDateTime)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel within 2 hours of appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = 'patient';
    appointment.cancellationReason = reason;
    await appointment.save();

    // Send cancellation email
    await emailService.sendAppointmentCancellation(req.user, appointment, reason, 'patient');

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, startTime } = req.body;
    const patientId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: id,
      patientId,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Can only reschedule upcoming appointments' });
    }

    // Check 2-hour rule
    if (slotService.isWithinTwoHours(appointment.appointmentDateTime)) {
      return res.status(400).json({ success: false, message: 'Cannot reschedule within 2 hours of appointment' });
    }

    // Validate new slot
    const availableSlots = await slotService.getAvailableSlots(appointmentDate, null);
    const isSlotAvailable = availableSlots.slots?.some((slot) => slot.startTime === startTime);

    if (!isSlotAvailable) {
      return res.status(400).json({ success: false, message: 'New slot not available' });
    }

    // Check for double booking on new date
    const existing = await Appointment.findOne({
      patientId,
      appointmentDate,
      _id: { $ne: id },
      status: { $in: ['upcoming', 'rescheduled'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an appointment on the new date' });
    }

    const oldAppointment = { ...appointment.toObject() };

    // Calculate end time
    const slotDuration = 30;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = (hours * 60 + minutes) + slotDuration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    appointment.appointmentDate = appointmentDate;
    appointment.appointmentDateTime = slotService.generateAppointmentDateTime(appointmentDate, startTime);
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = 'rescheduled';
    appointment.previousAppointmentId = id;

    await appointment.save();

    // Send reschedule email
    await emailService.sendAppointmentReschedule(req.user, oldAppointment, appointment);

    res.status(200).json({ success: true, message: 'Appointment rescheduled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
