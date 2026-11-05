const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, default: 'General' },
    location: { type: String, required: true, trim: true },
    type: { type: String, default: 'Full-time' },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
jobSchema.index({ title: 'text', description: 'text', department: 'text' });

module.exports = mongoose.model('Job', jobSchema);
