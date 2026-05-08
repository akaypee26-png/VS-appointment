const express = require('express');
const { check } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// All routes protected by admin auth middleware
router.use(adminAuth);

router.get('/appointments', adminController.getAllAppointments);

router.get('/appointments/:id', adminController.getAppointmentDetailsAdmin);

router.patch(
  '/appointments/:id/reschedule',
  [
    check('appointmentDate', 'Date is required').notEmpty(),
    check('startTime', 'Time is required').notEmpty(),
  ],
  adminController.rescheduleAppointmentAdmin
);

router.patch(
  '/appointments/:id/cancel',
  [check('reason', 'Reason is required').notEmpty()],
  adminController.cancelAppointmentAdmin
);

router.patch('/appointments/:id/complete', adminController.markAppointmentCompleted);

router.post(
  '/block-day',
  [
    check('blockDate', 'Block date is required').notEmpty(),
    check('reason', 'Reason is required').notEmpty(),
  ],
  adminController.blockFullDay
);

router.post(
  '/block-time-range',
  [
    check('blockDate', 'Block date is required').notEmpty(),
    check('startTime', 'Start time is required').notEmpty(),
    check('endTime', 'End time is required').notEmpty(),
    check('reason', 'Reason is required').notEmpty(),
  ],
  adminController.blockTimeRange
);

router.get('/blocked-dates', adminController.getBlockedDates);

module.exports = router;
