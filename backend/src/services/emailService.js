const nodemailer = require('nodemailer');
const config = require('../config/environment');

const transporter = nodemailer.createTransport({
  // Email service removed. All notification logic will be handled in-app.
      from: config.email_user,
      to: patient.email,
      subject: 'Appointment Confirmation - Dr. Smith\'s Clinic',
      html: appointmentConfirmationTemplate(patient, {
        ...appointment,
        displayTime,
      }),
    });
}catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

exports.sendAppointmentCancellation = async (patient, appointment, reason, cancelledBy) => {
  try {
    const displayTime = new Date(appointment.appointmentDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ` • ${appointment.startTime} - ${appointment.endTime}`;

    await transporter.sendMail({
      from: config.email_user,
      to: patient.email,
      subject: 'Appointment Cancelled - Dr. Smith\'s Clinic',
      html: appointmentCancellationTemplate(patient, {
        ...appointment,
        displayTime,
      }, reason, cancelledBy),
    });
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

exports.sendAppointmentReschedule = async (patient, oldAppointment, newAppointment) => {
  try {
    const oldDisplayTime = new Date(oldAppointment.appointmentDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ` • ${oldAppointment.startTime} - ${oldAppointment.endTime}`;

    const newDisplayTime = new Date(newAppointment.appointmentDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ` • ${newAppointment.startTime} - ${newAppointment.endTime}`;

    await transporter.sendMail({
      from: config.email_user,
      to: patient.email,
      subject: 'Appointment Rescheduled - Dr. Smith\'s Clinic',
      html: appointmentRescheduleTemplate(patient, {
        ...oldAppointment,
        displayTime: oldDisplayTime,
      }, {
        ...newAppointment,
        displayTime: newDisplayTime,
      }),
    });
  } catch (error) {
    console.error('Error sending reschedule email:', error);
  }
};
