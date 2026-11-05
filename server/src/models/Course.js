const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Course',
  new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    icon: { type: String, default: 'star' },
    modules: [String],
    order: { type: Number, default: 0 },
  })
);
