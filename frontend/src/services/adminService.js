import api from './api';

export const getAllAppointments = (status = null, date = null, patientId = null) => {
  const params = {};
  if (status) params.status = status;
  if (date) params.date = date;
  if (patientId) params.patientId = patientId;

  return api.get('/admin/appointments', { params });
};

export const getAppointmentDetailsAdmin = (id) => {
  return api.get(`/admin/appointments/${id}`);
};

export const rescheduleAppointmentAdmin = (id, appointmentDate, startTime) => {
  return api.patch(`/admin/appointments/${id}/reschedule`, {
    appointmentDate,
    startTime,
  });
};

export const cancelAppointmentAdmin = (id, reason) => {
  return api.patch(`/admin/appointments/${id}/cancel`, { reason });
};

export const markAppointmentCompleted = (id) => {
  return api.patch(`/admin/appointments/${id}/complete`);
};

export const blockFullDay = (blockDate, reason) => {
  return api.post('/admin/block-day', { blockDate, reason });
};

export const blockTimeRange = (blockDate, startTime, endTime, reason) => {
  return api.post('/admin/block-time-range', {
    blockDate,
    startTime,
    endTime,
    reason,
  });
};

export const getBlockedDates = () => {
  return api.get('/admin/blocked-dates');
};
