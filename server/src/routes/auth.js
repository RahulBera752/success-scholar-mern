
const router = require('express').Router();

const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const { protect, accountTypeOnly } = require('../middleware/auth');

const accountTypes = ['student', 'corporate', 'college', 'school', 'admin'];

// UPDATED: Student added to OTP registration.
const otpRegistrationTypes = ['student', 'corporate', 'college', 'school'];

// Temporary storage for OTP registrations.
// For production, use a database collection with TTL or Redis.
const pendingRegistrations = new Map();

const getAccountType = (user) =>
  user.accountType || (user.role === 'admin' ? 'admin' : 'student');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || !secret.trim()) {
    throw new Error('JWT_SECRET is missing from the backend environment.');
  }

  return secret;
};

const sign = (user) =>
  jwt.sign(
    { id: user._id },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  accountType: getAccountType(user),
  phone: user.phone,
  college: user.college,
});

const emailOk = (email) =>
  typeof email === 'string' &&
  /^\S+@\S+\.\S+$/.test(email.trim());

const normalizeEmail = (email) =>
  String(email || '').trim().toLowerCase();

const handleAuthError = (res, label, error) => {
  console.error(`[AUTH ${label} ERROR]`, error);

  return res.status(500).json({
    message: `${label} failed due to a server error. Check the backend terminal.`,
  });
};

// SMTP configuration
const mailer = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      'SMTP_USER and SMTP_PASS must be configured in server/.env.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const otpEmailFor = (accountType, form) =>
  accountType === 'college' || accountType === 'school'
    ? form.contactEmail
    : form.email;

// UPDATED: Added student name handling.
const getRegistrationName = (accountType, form) => {
  if (accountType === 'student') {
    return form.fullName;
  }

  if (accountType === 'corporate') {
    return form.employeeName;
  }

  if (accountType === 'college' || accountType === 'school') {
    return form.contactName;
  }

  return '';
};

const isStrongPassword = (password) =>
  typeof password === 'string' &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

// UPDATED: Added student registration fields.
// Existing account registration fields are unchanged.
const requiredFields = {
  student: [
    'fullName',
    'email',
    'phone',
    'dob',
    'password',
    'confirmPassword',
  ],

  corporate: [
    'companyName',
    'employeeName',
    'designation',
    'email',
    'district',
    'password',
    'confirmPassword',
  ],

  college: [
    'collegeName',
    'district',
    'state',
    'phone',
    'email',
    'affiliation',
    'stream',
    'studentCount',
    'budget',
    'contactName',
    'department',
    'designation',
    'contactPhone',
    'programType',
    'duration',
    'contactEmail',
    'password',
    'confirmPassword',
  ],

  school: [
    'schoolName',
    'district',
    'state',
    'phone',
    'email',
    'affiliation',
    'studentCount',
    'budget',
    'contactName',
    'department',
    'designation',
    'contactPhone',
    'programType',
    'duration',
    'contactEmail',
    'password',
    'confirmPassword',
  ],
};

const validateRegistration = (accountType, form) => {
  if (!otpRegistrationTypes.includes(accountType)) {
    return 'Invalid registration type.';
  }

  for (const field of requiredFields[accountType]) {
    if (!String(form[field] ?? '').trim()) {
      return `${field} is required.`;
    }
  }

  if (!emailOk(form.email)) {
    return accountType === 'student'
      ? 'Enter a valid email address.'
      : 'Enter a valid organization email address.';
  }

  const otpEmail = otpEmailFor(accountType, form);

  if (!emailOk(otpEmail)) {
    return 'Enter a valid contact email address for OTP verification.';
  }

  if (!isStrongPassword(form.password)) {
    return 'Password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character.';
  }

  if (form.password !== form.confirmPassword) {
    return 'Passwords do not match.';
  }

  for (const field of ['phone', 'contactPhone']) {
    if (
      form[field] &&
      !/^\d{10}$/.test(String(form[field]))
    ) {
      return `${field} must contain exactly 10 digits.`;
    }
  }

  for (const field of ['studentCount', 'budget']) {
    if (
      form[field] !== undefined &&
      form[field] !== '' &&
      (!Number.isFinite(Number(form[field])) ||
        Number(form[field]) < 0)
    ) {
      return `${field} must be a valid non-negative number.`;
    }
  }

  return null;
};

// ============================================================
// STUDENT REGISTRATION
// POST /api/auth/register
// Existing direct registration route preserved.
// ============================================================

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, college } = req.body || {};

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !emailOk(email)
    ) {
      return res.status(400).json({
        message: 'A valid name and email are required.',
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters.',
      });
    }

    getJwtSecret();

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone,
      college,
      role: 'student',
      accountType: 'student',
    });

    return res.status(201).json({
      token: sign(user),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already registered.',
      });
    }

    return handleAuthError(res, 'REGISTER', error);
  }
});

// ============================================================
// SEND OTP FOR STUDENT, CORPORATE, COLLEGE, OR SCHOOL
// POST /api/auth/register-otp/send
// ============================================================

router.post('/register-otp/send', async (req, res) => {
  try {
    const { accountType, ...form } = req.body || {};

    const validationError = validateRegistration(accountType, form);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    getJwtSecret();

    const organizationEmail = normalizeEmail(form.email);
    const verificationEmail = normalizeEmail(
      otpEmailFor(accountType, form)
    );

    const existingOrganizationEmail = await User.findOne({
      email: organizationEmail,
    });

    if (existingOrganizationEmail) {
      return res.status(409).json({
        message:
          accountType === 'student'
            ? 'This email is already registered.'
            : 'This organization email is already registered.',
      });
    }

    const existingVerificationEmail = await User.findOne({
      email: verificationEmail,
    });

    if (
      existingVerificationEmail &&
      verificationEmail !== organizationEmail
    ) {
      return res.status(409).json({
        message: 'This contact email is already registered.',
      });
    }

    const key = `${accountType}:${verificationEmail}`;
    const now = Date.now();
    const existingPending = pendingRegistrations.get(key);

    if (
      existingPending &&
      now - existingPending.createdAt < 60_000
    ) {
      return res.status(429).json({
        message: 'Please wait one minute before requesting another OTP.',
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    pendingRegistrations.set(key, {
      otpHash: crypto.createHash('sha256').update(otp).digest('hex'),
      expiresAt: now + 10 * 60_000,
      createdAt: now,
      attempts: 0,
      form: {
        ...form,
        email: organizationEmail,
        contactEmail:
          accountType === 'college' || accountType === 'school'
            ? verificationEmail
            : form.contactEmail,
      },
    });

    try {
      await mailer().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: verificationEmail,
        subject: 'Your Success Scholar registration OTP',
        text: `Your Success Scholar verification code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:28px;border:1px solid #e5e7eb;border-radius:16px">
            <h2 style="color:#10295f">Success Scholar</h2>
            <p>Use this verification code to complete your registration.</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1649c8;padding:18px 0">
              ${otp}
            </div>
            <p>This code expires in 10 minutes. Do not share this code with anyone.</p>
          </div>
        `,
      });
    } catch (error) {
      pendingRegistrations.delete(key);
      throw error;
    }

    return res.json({
      message: `A 6-digit OTP has been sent to ${verificationEmail}.`,
    });
  } catch (error) {
    console.error('[AUTH REGISTRATION OTP SEND ERROR]', error);

    return res.status(500).json({
      message:
        'Unable to send OTP. Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and the backend terminal.',
    });
  }
});

// ============================================================
// VERIFY OTP AND CREATE ACCOUNT
// POST /api/auth/register-otp/verify
// ============================================================

router.post('/register-otp/verify', async (req, res) => {
  try {
    const { accountType, otp } = req.body || {};

    if (!otpRegistrationTypes.includes(accountType)) {
      return res.status(400).json({
        message: 'Invalid registration type.',
      });
    }

    if (!/^\d{6}$/.test(String(otp || ''))) {
      return res.status(400).json({
        message: 'Enter the 6-digit OTP.',
      });
    }

    const suppliedForm = req.body || {};

    const verificationEmail = normalizeEmail(
      accountType === 'college' || accountType === 'school'
        ? suppliedForm.contactEmail
        : suppliedForm.email
    );

    const key = `${accountType}:${verificationEmail}`;
    const pending = pendingRegistrations.get(key);

    if (!pending) {
      return res.status(400).json({
        message:
          'No pending registration was found. Please request a new OTP.',
      });
    }

    if (Date.now() > pending.expiresAt) {
      pendingRegistrations.delete(key);

      return res.status(400).json({
        message: 'OTP expired. Please request a new one.',
      });
    }

    if (pending.attempts >= 5) {
      pendingRegistrations.delete(key);

      return res.status(429).json({
        message: 'Too many incorrect attempts. Request a new OTP.',
      });
    }

    const suppliedHash = crypto
      .createHash('sha256')
      .update(String(otp))
      .digest();

    const expectedHash = Buffer.from(pending.otpHash, 'hex');

    if (!crypto.timingSafeEqual(expectedHash, suppliedHash)) {
      pending.attempts += 1;

      return res.status(400).json({
        message: 'Incorrect OTP. Please try again.',
      });
    }

    const form = pending.form;
    const organizationEmail = normalizeEmail(form.email);

    const validationError = validateRegistration(accountType, form);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const existingOrganizationEmail = await User.findOne({
      email: organizationEmail,
    });

    if (existingOrganizationEmail) {
      pendingRegistrations.delete(key);

      return res.status(409).json({
        message: 'This email is already registered.',
      });
    }

    const name = String(
      getRegistrationName(accountType, form) ||
        form.companyName ||
        form.collegeName ||
        form.schoolName ||
        ''
    ).trim();

    if (!name) {
      return res.status(400).json({
        message: 'A contact name or organization name is required.',
      });
    }

    // Existing User schema compatibility preserved.
    const user = await User.create({
      name,
      email: organizationEmail,
      password: form.password,
      phone: form.contactPhone || form.phone || '',
      college:
        form.companyName ||
        form.collegeName ||
        form.schoolName ||
        '',
      role: 'student',
      accountType,
    });

    pendingRegistrations.delete(key);

    return res.status(201).json({
      message:
        'Email verified and registration completed. You can now sign in.',
      accountType,
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This email is already registered.',
      });
    }

    return handleAuthError(res, 'OTP REGISTRATION', error);
  }
});

// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

router.post('/login', async (req, res) => {
  try {
    const { email, password, accountType } = req.body || {};

    if (!emailOk(email) || typeof password !== 'string' || !password) {
      return res.status(400).json({
        message: 'A valid email and password are required.',
      });
    }

    if (
      accountType !== undefined &&
      !accountTypes.includes(accountType)
    ) {
      return res.status(400).json({
        message: 'Invalid account type.',
      });
    }

    getJwtSecret();

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    if (typeof user.matchPassword !== 'function') {
      throw new Error('User model is missing the matchPassword method.');
    }

    const passwordMatches = await user.matchPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    if (accountType && getAccountType(user) !== accountType) {
      return res.status(403).json({
        message: 'Use the sign-in page for your account type.',
      });
    }

    return res.json({
      token: sign(user),
      user: publicUser(user),
    });
  } catch (error) {
    return handleAuthError(res, 'LOGIN', error);
  }
});

// ============================================================
// GET CURRENTLY AUTHENTICATED USER
// GET /api/auth/me
// ============================================================

router.get('/me', protect, (req, res) => {
  return res.json({
    user: publicUser(req.user),
  });
});

// ============================================================
// VERIFY ACCOUNT TYPE
// GET /api/auth/account/:accountType
// ============================================================

router.get('/account/:accountType', protect, (req, res, next) => {
  const { accountType } = req.params;

  if (!accountTypes.includes(accountType)) {
    return res.status(404).json({
      message: 'Account area not found.',
    });
  }

  return accountTypeOnly(accountType)(req, res, () => {
    return res.json({
      user: publicUser(req.user),
      accountType,
    });
  });
});

module.exports = router;
