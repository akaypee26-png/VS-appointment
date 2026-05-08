import api from './api';

export const getAvailableSlots = (date) => {
  return api.get('/appointments/available-slots', { params: { date } });
};

export const bookAppointment = (appointmentDate, startTime, reasonForVisit) => {
  return api.post('/appointments/book', {
    appointmentDate,
    startTime,
    reasonForVisit,
  });
};

export const getMyAppointments = (status = null) => {
  const params = status ? { status } : {};
  return api.get('/appointments/my-appointments', { params });
};

export const getAppointmentDetails = (id) => {
  return api.get(`/appointments/${id}`);
};

export const cancelAppointment = (id, reason) => {
  return api.patch(`/appointments/${id}/cancel`, { reason });
};

export const rescheduleAppointment = (id, appointmentDate, startTime) => {
  return api.patch(`/appointments/${id}/reschedule`, {
    appointmentDate,
    startTime,
  });
};
