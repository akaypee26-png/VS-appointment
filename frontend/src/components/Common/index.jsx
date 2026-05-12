import React from 'react';

// LoadingSpinner - Medical themed
export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="w-full h-full border-4 border-clinical-200 border-t-medical-main rounded-full"></div>
      </div>
      <p className="mt-4 text-clinical-600 font-medium">{message}</p>
    </div>
  );
};

// Button - Professional medical styling
export const Button = ({
  children,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}) => {
  const baseClasses = `
    px-6 py-3 rounded-medical font-semibold transition-all duration-200
    flex items-center justify-center gap-2
    disabled:opacity-60 disabled:cursor-not-allowed
    hover:shadow-medical-hover active:scale-95
  `;

  const variants = {
    primary: 'bg-medical-main text-white hover:bg-medical-dark',
    secondary: 'bg-clinical-200 text-clinical-800 hover:bg-clinical-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-alert-600 text-white hover:bg-alert-700',
    outline: 'border-2 border-medical-main text-medical-main hover:bg-medical-light',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Alert - Medical color-coded alerts
export const Alert = ({ type = 'info', message = '', title = '', onClose = null }) => {
  const alerts = {
    success: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      text: 'text-green-800',
      icon: '✓',
      iconBg: 'bg-green-100',
    },
    error: {
      bg: 'bg-alert-50',
      border: 'border-l-4 border-alert-500',
      text: 'text-alert-800',
      icon: '⚠',
      iconBg: 'bg-alert-100',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-l-4 border-warning-500',
      text: 'text-warning-800',
      icon: '!',
      iconBg: 'bg-warning-100',
    },
    info: {
      bg: 'bg-medical-light',
      border: 'border-l-4 border-medical-main',
      text: 'text-medical-dark',
      icon: 'ℹ',
      iconBg: 'bg-medical-lighter',
    },
  };

  const config = alerts[type];

  return (
    <div className={`${config.bg} ${config.border} p-4 rounded-medical mb-4 flex gap-4 items-start`}>
      <div className={`${config.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
        {config.icon}
      </div>
      <div className="flex-1">
        {title && <h4 className={`${config.text} font-semibold mb-1`}>{title}</h4>}
        <p className={`${config.text} text-sm`}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className={`${config.text} hover:font-bold text-lg flex-shrink-0`}>
          ✕
        </button>
      )}
    </div>
  );
};

// Card - Clean professional medical card
export const Card = ({ children, className = '', header = '', footer = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-medical hover:shadow-medical-lg transition-shadow duration-200 p-card ${className}`}>
      {header && <div className="border-b border-clinical-200 pb-4 mb-4 font-semibold text-lg text-clinical-800">{header}</div>}
      {children}
      {footer && <div className="border-t border-clinical-200 pt-4 mt-4 text-sm text-clinical-600">{footer}</div>}
    </div>
  );
};

// Badge - Status indicator
export const Badge = ({ status = 'upcoming', className = '' }) => {
  const badges = {
    upcoming: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: '📅 Upcoming',
    },
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: '✓ Completed',
    },
    cancelled: {
      bg: 'bg-alert-100',
      text: 'text-alert-800',
      label: '✕ Cancelled',
    },
    rescheduled: {
      bg: 'bg-warning-100',
      text: 'text-warning-800',
      label: '⟳ Rescheduled',
    },
  };

  const config = badges[status] || badges.upcoming;

  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold inline-block ${className}`}>
      {config.label}
    </span>
  );
};

export default { LoadingSpinner, Button, Alert, Card, Badge };

