const { validationResult } = require('express-validator');

const errorHandler = (err, req, res, next) => {
  // Express validator errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
};

module.exports = errorHandler;
