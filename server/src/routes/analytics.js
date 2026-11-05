
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const visitorCounterSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  totalVisitors: {
    type: Number,
    default: 0,
  },
});

const VisitorCounter =
  mongoose.models.VisitorCounter ||
  mongoose.model('VisitorCounter', visitorCounterSchema);

// Return the current count and increment it for each recorded visit.
router.get('/visitors', async (req, res, next) => {
  try {
    const counter = await VisitorCounter.findOneAndUpdate(
      { key: 'success-scholar' },
      {
        $inc: { totalVisitors: 1 },
        $setOnInsert: { key: 'success-scholar' },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      totalVisitors: counter.totalVisitors,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
