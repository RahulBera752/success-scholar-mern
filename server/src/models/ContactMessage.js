const mongoose = require('mongoose');

module.exports = mongoose.model(
  'ContactMessage',
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      message: { type: String, required: true, maxlength: 2000 },
      status: { type: String, enum: ['new', 'read', 'closed'], default: 'new' },
    },
    { timestamps: true }
  )
);
