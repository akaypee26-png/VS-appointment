export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isValidPhone = (phone) => {
  return phone && phone.length >= 10;
};

export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateRegistration = (formData) => {
  const errors = {};

  if (!isValidName(formData.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Valid email is required';
  }

  if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!isValidPhone(formData.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};

  if (!isValidEmail(formData.email)) {
    errors.email = 'Valid email is required';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateAppointmentBooking = (formData) => {
  const errors = {};

  if (!formData.date) {
    errors.date = 'Date is required';
  }

  if (!formData.time) {
    errors.time = 'Time is required';
  }

  return errors;
};
