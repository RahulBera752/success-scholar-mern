const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Enquiry',
  new mongoose.Schema(
    {
      course: { type: String, required: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      bestTime: { type: String, default: 'Anytime' },
      message: { type: String, default: '' },
      status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    },
    { timestamps: true }
  )
);
