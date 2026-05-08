const Appointment = require('../models/Appointment');
const Block = require('../models/Block');
const config = require('../config/environment');

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const isWeekend = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const isBeyondAdvanceBooking = (dateString, advanceDays) => {
  const date = new Date(dateString);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + advanceDays);
  maxDate.setHours(23, 59, 59, 999);
  return date > maxDate;
};

exports.getAllDaySlots = () => {
  const slots = [];
  const start = config.clinic_hours_start;
  const end = config.clinic_hours_end;
  const lunch_start = config.lunch_start;
  const lunch_end = config.lunch_end;
  const duration = config.appointment_duration;

  for (let hour = start; hour < end; hour++) {
    for (let min = 0; min < 60; min += duration) {
      const startTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const endMinutes = timeToMinutes(startTime) + duration;
      const endTime = minutesToTime(endMinutes);

      const startHour = parseInt(startTime.split(':')[0]);
      if (startHour >= lunch_start && startHour < lunch_end) {
        continue;
      }

      slots.push({
        startTime,
        endTime,
        display: this.formatTimeDisplay(startTime),
      });
    }
  }

  return slots;
};

exports.formatTimeDisplay = (timeStr) => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

exports.isWithinTwoHours = (appointmentDateTime) => {
  const now = new Date();
  const appointment = new Date(appointmentDateTime);
  const diffMs = appointment - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < config.cancellation_hours;
};

exports.generateAppointmentDateTime = (date, startTime) => {
  return new Date(`${date}T${startTime}:00Z`);
};

exports.getAvailableSlots = async (dateString, doctorId) => {
  // Validation
  if (isWeekend(dateString)) {
    return { slots: [], message: 'Cannot book on weekends' };
  }

  if (isPastDate(dateString)) {
    return { slots: [], message: 'Cannot book for past dates' };
  }

  if (isBeyondAdvanceBooking(dateString, config.advance_booking_days)) {
    return { slots: [], message: `Can only book up to ${config.advance_booking_days} days in advance` };
  }

  // Get all day slots
  const allSlots = this.getAllDaySlots();

  // Get booked appointments for this date
  const bookedAppointments = await Appointment.find({
    appointmentDate: dateString,
    status: { $in: ['upcoming', 'rescheduled'] },
    $or: [
      { doctorId: doctorId },
      { doctorId: { $exists: true } },
    ],
  });

  // Get blocks for this date
  const blocks = await Block.find({
    blockDate: dateString,
    doctorId: doctorId,
  });

  // Filter available slots
  const availableSlots = allSlots.filter((slot) => {
    // Check if slot overlaps with any booked appointment
    const isBooked = bookedAppointments.some((apt) => apt.startTime === slot.startTime);
    if (isBooked) return false;

    // Check if slot overlaps with any block
    const isBlocked = blocks.some((block) => {
      if (block.blockType === 'full_day') return true;

      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      const blockStart = timeToMinutes(block.startTime);
      const blockEnd = timeToMinutes(block.endTime);

      return !(slotEnd <= blockStart || slotStart >= blockEnd);
    });

    return !isBlocked;
  });

  return { slots: availableSlots };
};
