export const formatAppointmentTime = (date, startTime, endTime) => {
  const d = new Date(date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = d.toLocaleDateString('en-US', options);
  return `${dateStr} • ${formatTimeDisplay(startTime)} - ${formatTimeDisplay(endTime)}`;
};

export const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMinDate = () => {
  return formatDateForInput(new Date());
};

export const getMaxDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return formatDateForInput(date);
};

export const isWeekend = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const getRelativeTime = (date) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';

  const diffDays = Math.floor((d - today) / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `in ${diffDays} days`;
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
