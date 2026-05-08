import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, LoadingSpinner } from '../Common/index';
import * as adminService from '../../services/adminService';
import { formatDateForInput } from '../../utils/dateFormatter';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [blockFullDayForm, setBlockFullDayForm] = useState({
    blockDate: '',
    reason: '',
  });
  const [blockTimeRangeForm, setBlockTimeRangeForm] = useState({
    blockDate: '',
    startTime: '',
    endTime: '',
    reason: '',
  });
  const [showBlockFullDayModal, setShowBlockFullDayModal] = useState(false);
  const [showBlockTimeRangeModal, setShowBlockTimeRangeModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getAllAppointments();
      const appointments = response.data.appointments;
      setStats({
        total: appointments.length,
        upcoming: appointments.filter((a) => a.status === 'upcoming').length,
        completed: appointments.filter((a) => a.status === 'completed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      });
    } catch (error) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockFullDay = async () => {
    if (!blockFullDayForm.blockDate || !blockFullDayForm.reason) {
      setError('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.blockFullDay(blockFullDayForm.blockDate, blockFullDayForm.reason);
      setShowBlockFullDayModal(false);
      setBlockFullDayForm({ blockDate: '', reason: '' });
      await fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to block day');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlockTimeRange = async () => {
    if (
      !blockTimeRangeForm.blockDate ||
      !blockTimeRangeForm.startTime ||
      !blockTimeRangeForm.endTime ||
      !blockTimeRangeForm.reason
    ) {
      setError('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.blockTimeRange(
        blockTimeRangeForm.blockDate,
        blockTimeRangeForm.startTime,
        blockTimeRangeForm.endTime,
        blockTimeRangeForm.reason
      );
      setShowBlockTimeRangeModal(false);
      setBlockTimeRangeForm({ blockDate: '', startTime: '', endTime: '', reason: '' });
      await fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to block time range');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Appointments', value: stats.total, color: 'blue' },
          { label: 'Upcoming', value: stats.upcoming, color: 'blue' },
          { label: 'Completed', value: stats.completed, color: 'green' },
          { label: 'Cancelled', value: stats.cancelled, color: 'red' },
        ].map((stat) => (
          <Card key={stat.label} className={`text-center border-t-4 border-${stat.color}-500`}>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Emergency Controls</h2>
        <div className="flex space-x-4 flex-wrap gap-4">
          <Button
            onClick={() => setShowBlockFullDayModal(true)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Block Full Day
          </Button>
          <Button
            onClick={() => setShowBlockTimeRangeModal(true)}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            Block Time Range
          </Button>
        </div>
      </Card>

      {/* Block Full Day Modal */}
      {showBlockFullDayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Block Full Day</h2>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={blockFullDayForm.blockDate}
                  onChange={(e) =>
                    setBlockFullDayForm({ ...blockFullDayForm, blockDate: e.target.value })
                  }
                  min={formatDateForInput(new Date())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={blockFullDayForm.reason}
                  onChange={(e) =>
                    setBlockFullDayForm({ ...blockFullDayForm, reason: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="2"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowBlockFullDayModal(false)}
                className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                loading={submitting}
                onClick={handleBlockFullDay}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Block Day
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Block Time Range Modal */}
      {showBlockTimeRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Block Time Range</h2>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={blockTimeRangeForm.blockDate}
                  onChange={(e) =>
                    setBlockTimeRangeForm({ ...blockTimeRangeForm, blockDate: e.target.value })
                  }
                  min={formatDateForInput(new Date())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={blockTimeRangeForm.startTime}
                  onChange={(e) =>
                    setBlockTimeRangeForm({ ...blockTimeRangeForm, startTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={blockTimeRangeForm.endTime}
                  onChange={(e) =>
                    setBlockTimeRangeForm({ ...blockTimeRangeForm, endTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={blockTimeRangeForm.reason}
                  onChange={(e) =>
                    setBlockTimeRangeForm({ ...blockTimeRangeForm, reason: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="2"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowBlockTimeRangeModal(false)}
                className="flex-1 bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                loading={submitting}
                onClick={handleBlockTimeRange}
                className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
              >
                Block Range
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
