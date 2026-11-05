const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Testimonial',
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      role: { type: String, default: 'Student' },
      avatar: { type: String, trim: true },
      quote: { type: String, required: true, maxlength: 600 },
      approved: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

