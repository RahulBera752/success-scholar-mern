const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Enquiry = require('../models/Enquiry');
const ContactMessage = require('../models/ContactMessage');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Testimonial = require('../models/Testimonial');

router.use(protect, adminOnly);

router.get('/stats', async (req, res, next) => {
  try {
    const [users, enquiries, newEnquiries, messages, jobs, applications, pendingTestimonials] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      ContactMessage.countDocuments(),
      Job.countDocuments({ active: true }),
      Application.countDocuments(),
      Testimonial.countDocuments({ approved: false }),
    ]);
    res.json({ users, enquiries, newEnquiries, messages, jobs, applications, pendingTestimonials });
  } catch (e) { next(e); }
});

// Generic helpers for simple list/status/delete resources
const listRoute = (path, Model, sort = '-createdAt', populate) =>
  router.get(path, async (req, res, next) => {
    try {
      let q = Model.find().sort(sort);
      if (populate) q = q.populate(populate);
      res.json(await q);
    } catch (e) { next(e); }
  });

const deleteRoute = (path, Model) =>
  router.delete(`${path}/:id`, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (e) { next(e); }
  });

const statusRoute = (path, Model, allowed) =>
  router.patch(`${path}/:id/status`, async (req, res, next) => {
    try {
      if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
      const doc = await Model.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (e) { next(e); }
  });

listRoute('/enquiries', Enquiry);
statusRoute('/enquiries', Enquiry, ['new', 'contacted', 'closed']);
deleteRoute('/enquiries', Enquiry);

listRoute('/messages', ContactMessage);
statusRoute('/messages', ContactMessage, ['new', 'read', 'closed']);
deleteRoute('/messages', ContactMessage);

listRoute('/applications', Application, '-createdAt', { path: 'job', select: 'title' });
deleteRoute('/applications', Application);

listRoute('/users', User);
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (String(req.user._id) === req.params.id) return res.status(400).json({ message: 'You cannot delete yourself' });
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

// Jobs CRUD
listRoute('/jobs', Job);
router.post('/jobs', async (req, res, next) => {
  try { res.status(201).json(await Job.create(req.body)); } catch (e) { next(e); }
});
router.put('/jobs/:id', async (req, res, next) => {
  try {
    const doc = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});
deleteRoute('/jobs', Job);

// Testimonials moderation
listRoute('/testimonials', Testimonial);
router.patch('/testimonials/:id/approve', async (req, res, next) => {
  try {
    const doc = await Testimonial.findByIdAndUpdate(req.params.id, { approved: !!req.body.approved }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});
router.post('/testimonials', async (req, res, next) => {
  try { res.status(201).json(await Testimonial.create({ ...req.body, avatar: req.body.avatar || '', approved: true })); } catch (e) { next(e); }
});
deleteRoute('/testimonials', Testimonial);

// Courses (Expertise) edit
router.put('/courses/:id', async (req, res, next) => {
  try {
    const { title, summary, modules } = req.body;
    const doc = await Course.findByIdAndUpdate(req.params.id, { title, summary, modules }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

module.exports = router;

