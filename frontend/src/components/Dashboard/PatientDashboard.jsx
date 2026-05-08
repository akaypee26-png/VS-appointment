import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Card, Badge, LoadingSpinner } from '../Common/index';
import * as appointmentService from '../../services/appointmentService';
import { formatAppointmentTime } from '../../utils/dateFormatter';

const AppointmentCard = ({ appointment, onCancel, onReschedule, isAdmin = false }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-l-4 border-blue-500 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {formatAppointmentTime(appointment.appointmentDate, appointment.startTime, appointment.endTime)}
          </h3>
          {appointment.reasonForVisit && (
            <p className="text-gray-600 text-sm mt-1">Reason: {appointment.reasonForVisit}</p>
          )}
          {isAdmin && (
            <p className="text-gray-600 text-sm">Patient: {appointment.patientName}</p>
          )}
        </div>
        <Badge status={appointment.status} />
      </div>

      {appointment.cancellationReason && (
        <p className="text-sm text-gray-600 mb-3">
          Cancellation: {appointment.cancellationReason}
        </p>
      )}

      <div className="flex space-x-2">
        {appointment.status === 'upcoming' && (
          <>
            <Button
              onClick={() => navigate(`${isAdmin ? '/admin' : ''}/reschedule-appointment/${appointment._id}`)}
              className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
            >
              Reschedule
            </Button>
            <Button
              onClick={() => onCancel(appointment._id)}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [error, setError] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getMyAppointments(
        activeTab === 'all' ? null : activeTab
      );
      setAppointments(response.data.appointments || []);
    } catch (error) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await appointmentService.cancelAppointment(selectedAppointmentId, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      fetchAppointments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter((a) => a.status === 'upcoming').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  if (loading && appointments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <Button onClick={() => navigate('/book-appointment')} className="bg-green-600 text-white hover:bg-green-700">
          Book Appointment
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Upcoming', value: stats.upcoming, color: 'blue' },
          { label: 'Completed', value: stats.completed, color: 'green' },
          { label: 'Cancelled', value: stats.cancelled, color: 'red' },
        ].map((stat) => (
          <Card key={stat.label} className={`text-center border-t-4 border-${stat.color || 'gray'}-500`}>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {appointments.length === 0 ? (
        <Alert type="info" message={`No ${activeTab} appointments`} />
      ) : (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            onCancel={handleCancelClick}
          />
        ))
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Cancel Appointment</h2>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows="3"
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
              >
                Close
              </Button>
              <Button
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
