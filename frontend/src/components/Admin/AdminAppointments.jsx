import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Card, Badge, LoadingSpinner } from '../Common/index';
import * as adminService from '../../services/adminService';
import { formatAppointmentTime } from '../../utils/dateFormatter';

export const AdminAppointments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllAppointments(
        statusFilter || null,
        dateFilter || null
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
      await adminService.cancelAppointmentAdmin(selectedAppointmentId, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      fetchAppointments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      await adminService.markAppointmentCompleted(appointmentId);
      fetchAppointments();
    } catch (error) {
      setError('Failed to mark appointment as completed');
    }
  };

  if (loading && appointments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Appointments</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setStatusFilter('');
                setDateFilter('');
              }}
              className="w-full bg-gray-400 text-white hover:bg-gray-500"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      {appointments.length === 0 ? (
        <Alert type="info" message="No appointments found" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Patient</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date & Time</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Reason</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{apt.patientName}</p>
                      <p className="text-sm text-gray-600">{apt.patientEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">
                      {formatAppointmentTime(apt.appointmentDate, apt.startTime, apt.endTime)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{apt.reasonForVisit || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={apt.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {apt.status === 'upcoming' && (
                        <>
                          <Button
                            onClick={() => navigate(`/admin/reschedule-appointment/${apt._id}`)}
                            className="text-xs bg-blue-500 text-white hover:bg-blue-600 px-2 py-1"
                          >
                            Reschedule
                          </Button>
                          <Button
                            onClick={() => handleMarkCompleted(apt._id)}
                            className="text-xs bg-green-500 text-white hover:bg-green-600 px-2 py-1"
                          >
                            Complete
                          </Button>
                          <Button
                            onClick={() => handleCancelClick(apt._id)}
                            className="text-xs bg-red-500 text-white hover:bg-red-600 px-2 py-1"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AdminAppointments;
