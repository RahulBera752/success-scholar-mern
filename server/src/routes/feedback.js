const router = require('express').Router();
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/auth');

const allowedCategories = [
  'Website experience',
  'Courses and learning',
  'Mentorship and support',
  'Booking and enrollment',
  'Certificates',
  'Other'
];
const allowedStatuses = ['new', 'reviewed', 'resolved'];

router.post('/', protect, async (req, res, next) => {
  try {
    const { category, rating, message, suggestion = '' } = req.body;
    const cleanMessage = typeof message === 'string' ? message.trim() : '';
    const cleanSuggestion = typeof suggestion === 'string' ? suggestion.trim() : '';
    const numericRating = Number(rating);

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Please select a valid feedback category.' });
    }
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Please select a rating from 1 to 5.' });
    }
    if (cleanMessage.length < 10 || cleanMessage.length > 2000) {
      return res.status(400).json({ message: 'Feedback must be between 10 and 2000 characters.' });
    }
    if (cleanSuggestion.length > 1000) {
      return res.status(400).json({ message: 'Suggestions must be 1000 characters or fewer.' });
    }

    const feedback = await Feedback.create({
      student: req.user._id,
      studentName: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      category,
      rating: numericRating,
      message: cleanMessage,
      suggestion: cleanSuggestion
    });

    return res.status(201).json({
      message: 'Thank you! Your feedback has been submitted to the admin team.',
      feedback: { id: feedback._id, status: feedback.status }
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/admin', protect, adminOnly, async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('student', 'name email phone')
      .lean();
    return res.json({
      feedback: feedback.map((item) => ({
        ...item,
        studentName: item.studentName || item.student?.name || 'Student',
        email: item.email || item.student?.email || '',
        phone: item.phone || item.student?.phone || ''
      }))
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/admin/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid feedback status.' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('student', 'name email phone');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    return res.json({
      feedback: {
        ...feedback.toObject(),
        studentName: feedback.studentName || feedback.student?.name || 'Student',
        email: feedback.email || feedback.student?.email || '',
        phone: feedback.phone || feedback.student?.phone || ''
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
