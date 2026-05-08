const Appointment = require('../models/Appointment');
const Block = require('../models/Block');
const User = require('../models/User');
const slotService = require('../services/slotService');
const emailService = require('../services/emailService');

exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date, patientId } = req.query;

    let query = {};
    if (status) query.status = status;
    if (date) query.appointmentDate = date;
    if (patientId) query.patientId = patientId;

    const appointments = await Appointment.find(query).sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointmentDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rescheduleAppointmentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, startTime } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Can only reschedule upcoming appointments' });
    }

    // Validate new slot
    const availableSlots = await slotService.getAvailableSlots(appointmentDate, null);
    const isSlotAvailable = availableSlots.slots?.some((slot) => slot.startTime === startTime);

    if (!isSlotAvailable) {
      return res.status(400).json({ success: false, message: 'New slot not available' });
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

    // Send email to patient
    const patient = await User.findById(appointment.patientId);
    if (patient) {
      await emailService.sendAppointmentReschedule(patient, oldAppointment, appointment);
    }

    res.status(200).json({ success: true, message: 'Appointment rescheduled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelAppointmentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Can only cancel upcoming appointments' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = 'doctor';
    appointment.cancellationReason = reason;
    await appointment.save();

    // Send email to patient
    const patient = await User.findById(appointment.patientId);
    if (patient) {
      await emailService.sendAppointmentCancellation(patient, appointment, reason, 'doctor');
    }

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAppointmentCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment marked as completed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.blockFullDay = async (req, res) => {
  try {
    const { blockDate, reason } = req.body;
    const doctorId = req.user._id;

    // Create block
    const block = new Block({
      doctorId,
      blockType: 'full_day',
      blockDate,
      reason,
    });

    // Find and cancel all appointments on this day
    const appointments = await Appointment.find({
      appointmentDate: blockDate,
      status: 'upcoming',
    });

    const affectedAppointmentIds = [];
    for (const apt of appointments) {
      apt.status = 'cancelled';
      apt.cancelledBy = 'system';
      apt.cancellationReason = `Clinic blocked: ${reason}`;
      await apt.save();
      affectedAppointmentIds.push(apt._id);

      // Send cancellation email
      const patient = await User.findById(apt.patientId);
      if (patient) {
        await emailService.sendAppointmentCancellation(patient, apt, `Clinic blocked: ${reason}`, 'system');
      }
    }

    block.affectedAppointments = affectedAppointmentIds;
    await block.save();

    res.status(201).json({
      success: true,
      message: `Day blocked. ${appointments.length} appointments cancelled.`,
      block,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.blockTimeRange = async (req, res) => {
  try {
    const { blockDate, startTime, endTime, reason } = req.body;
    const doctorId = req.user._id;

    // Create block
    const block = new Block({
      doctorId,
      blockType: 'time_range',
      blockDate,
      startTime,
      endTime,
      reason,
    });

    // Find and cancel overlapping appointments
    const appointments = await Appointment.find({
      appointmentDate: blockDate,
      status: 'upcoming',
    });

    const timeToMinutes = (time) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const affectedAppointmentIds = [];
    for (const apt of appointments) {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);
      const blockStart = timeToMinutes(startTime);
      const blockEnd = timeToMinutes(endTime);

      // Check for overlap
      if (!(aptEnd <= blockStart || aptStart >= blockEnd)) {
        apt.status = 'cancelled';
        apt.cancelledBy = 'system';
        apt.cancellationReason = `Time range blocked: ${reason}`;
        await apt.save();
        affectedAppointmentIds.push(apt._id);

        // Send cancellation email
        const patient = await User.findById(apt.patientId);
        if (patient) {
          await emailService.sendAppointmentCancellation(patient, apt, `Time range blocked: ${reason}`, 'system');
        }
      }
    }

    block.affectedAppointments = affectedAppointmentIds;
    await block.save();

    res.status(201).json({
      success: true,
      message: `Time range blocked. ${affectedAppointmentIds.length} appointments cancelled.`,
      block,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlockedDates = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const blocks = await Block.find({ doctorId }).sort({ blockDate: -1 });

    res.status(200).json({ success: true, blocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
