const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Application',
  new mongoose.Schema(
    {
      job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      note: { type: String, default: '' },
    },
    { timestamps: true }
  )
);
