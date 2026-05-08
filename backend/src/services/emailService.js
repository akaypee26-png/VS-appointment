const nodemailer = require('nodemailer');
const config = require('../config/environment');

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: config.smtp_port,
  secure: false,
  auth: {
    user: config.email_user,
    pass: config.email_password,
  },
});

const appointmentConfirmationTemplate = (patient, appointment) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
      <h1>Appointment Confirmed</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${patient.name},</p>
      <p>Your appointment has been successfully booked!</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Appointment Details</h3>
        <p><strong>Date & Time:</strong> ${appointment.displayTime}</p>
        <p><strong>Doctor:</strong> Dr. Smith</p>
        ${appointment.reasonForVisit ? `<p><strong>Reason for Visit:</strong> ${appointment.reasonForVisit}</p>` : ''}
      </div>

      <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <strong>Important:</strong> Please arrive 15 minutes early for registration and payment.
      </div>

      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Clinic Information</h3>
        <p><strong>Address:</strong> 123 Medical Center, City</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567</p>
        <p><strong>Hours:</strong> Monday - Friday, 10:00 AM - 5:00 PM (Lunch: 1:00 PM - 2:00 PM)</p>
      </div>

      <p>If you need to cancel or reschedule, please do so at least 2 hours before your appointment.</p>
      <p>Best regards,<br>Dr. Smith's Clinic</p>
    </div>
  </div>
`;

const appointmentCancellationTemplate = (patient, appointment, reason, cancelledBy) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
      <h1>Appointment Cancelled</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${patient.name},</p>
      <p>Your appointment has been cancelled.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Cancelled Appointment</h3>
        <p><strong>Date & Time:</strong> ${appointment.displayTime}</p>
        <p><strong>Cancelled By:</strong> ${cancelledBy === 'patient' ? 'You' : cancelledBy === 'doctor' ? 'Doctor' : 'System'}</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>

      <p>You can book a new appointment anytime through your account.</p>
      <p>If you have any questions, please contact us at +1 (555) 123-4567</p>
      <p>Best regards,<br>Dr. Smith's Clinic</p>
    </div>
  </div>
`;

const appointmentRescheduleTemplate = (patient, oldAppointment, newAppointment) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
      <h1>Appointment Rescheduled</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${patient.name},</p>
      <p>Your appointment has been successfully rescheduled!</p>
      
      <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Previous Appointment</h3>
        <p><strong>Date & Time:</strong> ${oldAppointment.displayTime}</p>
      </div>

      <div style="background-color: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>New Appointment</h3>
        <p><strong>Date & Time:</strong> ${newAppointment.displayTime}</p>
      </div>

      <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <strong>Important:</strong> Please arrive 15 minutes early for registration and payment.
      </div>

      <p>Best regards,<br>Dr. Smith's Clinic</p>
    </div>
  </div>
`;

exports.sendAppointmentConfirmation = async (patient, appointment) => {
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
      subject: 'Appointment Confirmation - Dr. Smith\'s Clinic',
      html: appointmentConfirmationTemplate(patient, {
        ...appointment,
        displayTime,
      }),
    });
  } catch (error) {
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
