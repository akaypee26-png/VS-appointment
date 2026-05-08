import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as appointmentService from '../../services/appointmentService';
import { formatDateForInput, getMinDate, getMaxDate, isWeekend, formatAppointmentTime } from '../../utils/dateFormatter';
import { Button, Alert, Card, LoadingSpinner } from '../Common/index';

export const RescheduleAppointment = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [appointment, setAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    if (selectedDate && !isWeekend(selectedDate)) {
      fetchSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const fetchAppointment = async () => {
    try {
      const data = await appointmentService.getAppointmentDetails(id);
      setAppointment(data.data.appointment);
      setLoading(false);
    } catch (error) {
      setError('Failed to load appointment');
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      const data = await appointmentService.getAvailableSlots(selectedDate);
      setAvailableSlots(data.data.slots || []);
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Please select date and time');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentService.rescheduleAppointment(id, selectedDate, selectedSlot);
      setSuccess('Appointment rescheduled successfully!');
      setTimeout(() => {
        navigate(isAdmin ? '/admin/appointments' : '/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <Alert type="error" message="Appointment not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Reschedule Appointment</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      {/* Current Appointment */}
      <Card className="mb-8 border-l-4 border-blue-500">
        <h2 className="text-lg font-semibold mb-4">Current Appointment</h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Date & Time:</strong> {formatAppointmentTime(appointment.appointmentDate, appointment.startTime, appointment.endTime)}
          </p>
          {appointment.reasonForVisit && (
            <p>
              <strong>Reason:</strong> {appointment.reasonForVisit}
            </p>
          )}
        </div>
      </Card>

      {/* Reschedule Form */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">Select New Date & Time</h2>

        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">New Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">Monday to Friday, up to 30 days from today</p>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">New Time</label>

              {slotsLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading available times...</p>
                </div>
              ) : availableSlots.length === 0 && selectedDate ? (
                <Alert type="warning" message="No available slots for this date" />
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelectedSlot(slot.startTime)}
                      className={`p-3 rounded-lg border-2 transition ${
                        selectedSlot === slot.startTime
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{slot.display}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {selectedDate && selectedSlot && (
            <Card className="bg-blue-50 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Rescheduling to:</strong>
              </p>
              <p className="text-lg font-semibold text-blue-600">
                {formatAppointmentTime(selectedDate, selectedSlot)}
              </p>
            </Card>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <Button
              onClick={() => navigate(isAdmin ? '/admin/appointments' : '/dashboard')}
              className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              loading={submitting}
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedSlot}
              className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Reschedule
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RescheduleAppointment;
