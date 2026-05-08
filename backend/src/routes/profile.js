const express = require('express');
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

const router = express.Router();

// All routes protected by auth middleware
router.use(auth);

router.get('/', profileController.getProfile);

router.patch(
  '/',
  [
    check('name', 'Name is required').optional().notEmpty(),
    check('phone', 'Phone is required').optional().notEmpty(),
  ],
  profileController.updateProfile
);

router.patch(
  '/change-password',
  [
    check('currentPassword', 'Current password is required').notEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
  ],
  profileController.changePassword
);

router.delete('/', profileController.deleteAccount);

module.exports = router;
