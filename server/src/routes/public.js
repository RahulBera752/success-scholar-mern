const router = require('express').Router();
const Course = require('../models/Course');
const Enquiry = require('../models/Enquiry');
const ContactMessage = require('../models/ContactMessage');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Testimonial = require('../models/Testimonial');

const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e || '');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/health', (req, res) => res.json({ ok: true }));

router.get('/courses', async (req, res, next) => {
  try { res.json(await Course.find().sort('order')); } catch (e) { next(e); }
});

router.get('/testimonials', async (req, res, next) => {
  try { res.json(await Testimonial.find({ approved: true }).sort('-createdAt')); } catch (e) { next(e); }
});

router.post('/testimonials', async (req, res, next) => {
  try {
    const { name, quote, role } = req.body;
    if (!name || !quote) return res.status(400).json({ message: 'Name and testimonial are required' });
    // Submitted testimonials wait for admin approval
    await Testimonial.create({ name, quote, role: role || 'Student', avatar: '', approved: false });
    res.status(201).json({ message: 'Thank you! Your testimonial will appear after review.' });
  } catch (e) { next(e); }
});

router.post('/enquiries', async (req, res, next) => {
  try {
    const { course, name, email, phone, bestTime, message } = req.body;
    if (!course || !name || !emailOk(email) || !phone) return res.status(400).json({ message: 'Course, name, valid email and phone are required' });
    await Enquiry.create({ course, name, email, phone, bestTime, message });
    res.status(201).json({ message: 'Enquiry submitted. We will get back to you soon.' });
  } catch (e) { next(e); }
});

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !emailOk(email) || !message) return res.status(400).json({ message: 'Name, valid email and message are required' });
    await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ message: 'Message sent. Thank you for contacting us!' });
  } catch (e) { next(e); }
});

// Careers search: ?q=digital&location=kolkata
router.get('/jobs', async (req, res, next) => {
  try {
    const { q, location } = req.query;
    const filter = { active: true };
    if (q) {
      const rx = new RegExp(escapeRegex(String(q)), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { department: rx }];
    }
    if (location) filter.location = new RegExp(escapeRegex(String(location)), 'i');
    res.json(await Job.find(filter).sort('-createdAt'));
  } catch (e) { next(e); }
});

router.post('/jobs/:id/apply', async (req, res, next) => {
  try {
    const { name, email, phone, note } = req.body;
    if (!name || !emailOk(email)) return res.status(400).json({ message: 'Name and valid email are required' });
    const job = await Job.findOne({ _id: req.params.id, active: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await Application.create({ job: job._id, name, email, phone, note });
    res.status(201).json({ message: `Application for "${job.title}" received.` });
  } catch (e) { next(e); }
});

module.exports = router;

