const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studentName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'Website experience',
        'Courses and learning',
        'Mentorship and support',
        'Booking and enrollment',
        'Certificates',
        'Other'
      ]
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    suggestion: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
