import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export const Button = ({
  children,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-4 py-2 rounded-lg font-medium transition ${className} ${
      disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    {...props}
  >
    {loading ? (
      <span className="flex items-center">
        <span className="animate-spin h-4 w-4 border-b-2 border-white mr-2"></span>
        Loading...
      </span>
    ) : (
      children
    )}
  </button>
);

export const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${colors[type]}`}>
      <div className="flex justify-between items-start">
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>{children}</div>
);

export const Badge = ({ status }) => {
  const colors = {
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status] || colors.upcoming}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};
