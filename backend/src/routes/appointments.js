const express = require('express');
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

// All routes protected by auth middleware
router.use(auth);

router.get('/available-slots', appointmentController.getAvailableSlots);

router.post(
  '/book',
  [
    check('appointmentDate', 'Date is required').notEmpty(),
    check('startTime', 'Time is required').notEmpty(),
  ],
  appointmentController.bookAppointment
);

router.get('/my-appointments', appointmentController.getMyAppointments);

router.get('/:id', appointmentController.getAppointmentDetails);

router.patch(
  '/:id/cancel',
  [check('reason', 'Reason is required').notEmpty()],
  appointmentController.cancelAppointment
);

router.patch(
  '/:id/reschedule',
  [
    check('appointmentDate', 'Date is required').notEmpty(),
    check('startTime', 'Time is required').notEmpty(),
  ],
  appointmentController.rescheduleAppointment
);

module.exports = router;
