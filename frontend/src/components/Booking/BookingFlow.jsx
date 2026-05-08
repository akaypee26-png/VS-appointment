import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as appointmentService from '../../services/appointmentService';
import { formatDateForInput, getMinDate, getMaxDate, isWeekend } from '../../utils/dateFormatter';
import { Button, Alert, Card, LoadingSpinner } from '../Common/index';

export const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: date, 2: time, 3: confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fetchSlots = async (date) => {
    setSlotsLoading(true);
    try {
      const response = await appointmentService.getAvailableSlots(date);
      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      setError('Failed to load available slots');
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (!isWeekend(date)) {
      fetchSlots(date);
      setSelectedTime('');
    } else {
      setError('Cannot book on weekends');
      setAvailableSlots([]);
    }
  };

  const handleContinue = () => {
    if (step === 1 && selectedDate) {
      setStep(2);
    } else if (step === 2 && selectedTime) {
      setStep(3);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select date and time');
      return;
    }

    setLoading(true);
    try {
      await appointmentService.bookAppointment(selectedDate, selectedTime, reasonForVisit);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Book an Appointment</h1>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        {/* Step 1: Date Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Date</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <p className="text-sm text-gray-500 mb-6">Monday to Friday, up to 30 days from today</p>
            <Button
              onClick={handleContinue}
              disabled={!selectedDate}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Time</h2>
            <p className="text-gray-600 mb-4">
              Available slots for {new Date(selectedDate).toLocaleDateString()}:
            </p>

            {slotsLoading ? (
              <LoadingSpinner />
            ) : availableSlots.length === 0 ? (
              <Alert type="warning" message="No available slots for this date" />
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => setSelectedTime(slot.startTime)}
                    className={`p-3 rounded-lg border-2 transition font-medium ${
                      selectedTime === slot.startTime
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="Reason for visit (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              rows="2"
            />

            <div className="flex space-x-2">
              <Button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedTime}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Confirm Appointment</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Date & Time:</strong>
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {selectedTime}
              </p>
              {reasonForVisit && (
                <p className="text-sm">
                  <strong>Reason:</strong> {reasonForVisit}
                </p>
              )}
            </div>

            <Alert
              type="warning"
              message="Please arrive 15 minutes early for registration and payment."
            />

            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
              >
                Back
              </Button>
              <Button
                loading={loading}
                onClick={handleBook}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingFlow;
