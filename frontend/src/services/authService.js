import api from './api';

export const register = (name, email, password, phone, role = 'patient') => {
  return api.post('/auth/register', { name, email, password, phone, role });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

export const getProfile = () => {
  return api.get('/profile');
};

export const updateProfile = (name, phone) => {
  return api.patch('/profile', { name, phone });
};

export const changePassword = (currentPassword, newPassword) => {
  return api.patch('/profile/change-password', { currentPassword, newPassword });
};

export const deleteAccount = () => {
  return api.delete('/profile');
};
