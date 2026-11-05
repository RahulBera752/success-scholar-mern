
const express = require('express');
const crypto = require('node:crypto');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');

const router = express.Router();

const DEMO_AMOUNT = 10000; // ₹100 in paise

const plans = {
  silver: 1699,
  gold: 2999,
  platinum: 4449,
};

const discounts = {
  1: 0.10,
  3: 0.05,
  6: 0.075,
  9: 0.10,
};

const validCourses = new Set([
  'soft-skills',
  'interview-prep',
  'personality-dev',
  'adv-comm',
  'spoken-english',
  'campus-readiness',
]);

const validDays = new Set([
  'Wednesday',
  'Friday',
  'Saturday',
]);

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      'Razorpay credentials are not configured on the server.'
    );
  }

  return new Razorpay({ key_id, key_secret });
}

function calculateAmount(plan, duration, slotChoice) {
  const originalFee = plans[plan] * duration;
  const discountedFee = Math.round(
    originalFee * (1 - discounts[duration])
  );

  const slotFee = slotChoice === 'own' ? 99 : 0;
  const taxable = discountedFee + 200 + slotFee;

  return Math.round(taxable * 1.18 * 100);
}

function validDate(value) {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function verifySignature(orderId, paymentId, signature) {
  if (
    typeof orderId !== 'string' ||
    typeof paymentId !== 'string' ||
    typeof signature !== 'string' ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest();

  const suppliedSignature = Buffer.from(signature, 'hex');

  return (
    suppliedSignature.length === expectedSignature.length &&
    crypto.timingSafeEqual(suppliedSignature, expectedSignature)
  );
}

function isStudent(req) {
  return (
    (req.user.accountType || 'student') === 'student' &&
    req.user.role !== 'admin'
  );
}

/*
|--------------------------------------------------------------------------
| DEMO BOOKING PAYMENT
|--------------------------------------------------------------------------
| POST /api/payment/demo/create-order
| POST /api/payment/demo/verify
| GET  /api/payment/my-demo-bookings
*/

router.post('/demo/create-order', protect, async (req, res) => {
  if (!isStudent(req)) {
    return res.status(403).json({
      message: 'Only student accounts can book a demo.',
    });
  }

  try {
    const phone = String(req.body.phone || '').replace(/\D/g, '');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: DEMO_AMOUNT,
      currency: 'INR',
      receipt: `demo_${Date.now()}_${crypto
        .randomBytes(3)
        .toString('hex')}`,
      notes: {
        bookingType: 'demo',
        phone,
        userId: String(req.user._id),
      },
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Demo order creation failed:', error.message);

    return res.status(500).json({
      message:
        'Unable to create demo payment order. Check your Razorpay configuration and try again.',
    });
  }
});

router.post('/demo/verify', protect, async (req, res) => {
  if (!isStudent(req)) {
    return res.status(403).json({
      verified: false,
      message: 'Only student accounts can verify a demo booking.',
    });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      return res.status(400).json({
        verified: false,
        message: 'Payment signature verification failed.',
      });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (
      !order ||
      order.id !== razorpay_order_id ||
      order.amount !== DEMO_AMOUNT ||
      order.currency !== 'INR' ||
      order.notes?.bookingType !== 'demo' ||
      String(order.notes?.userId || '') !== String(req.user._id)
    ) {
      return res.status(400).json({
        verified: false,
        message: 'Invalid demo payment order.',
      });
    }

    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== order.id ||
      payment.amount !== DEMO_AMOUNT ||
      payment.currency !== 'INR' ||
      payment.status !== 'captured'
    ) {
      return res.status(400).json({
        verified: false,
        message:
          'Payment has not been confirmed as captured. Check your payment status before trying again.',
      });
    }

    const existingBooking = (req.user.demoBookings || []).some(
      (booking) =>
        booking.paymentId === payment.id ||
        booking.orderId === order.id
    );

    if (!existingBooking) {
      req.user.demoBookings.push({
        title: 'Demo Class Booking',
        bookingType: 'demo',
        phone: String(order.notes?.phone || req.user.phone || ''),
        amount: DEMO_AMOUNT,
        currency: 'INR',
        paymentStatus: 'paid',
        paymentId: payment.id,
        orderId: order.id,
        bookedAt: new Date(),
      });

      await req.user.save();
    }

    const savedBooking = (req.user.demoBookings || []).find(
      (booking) =>
        booking.paymentId === payment.id ||
        booking.orderId === order.id
    );

    return res.json({
      verified: true,
      message: 'Demo payment verified and booking saved successfully.',
      paymentId: payment.id,
      orderId: order.id,
      booking: {
        _id: savedBooking?._id,
        title: 'Demo Class Booking',
        paymentStatus: 'paid',
        amountRupees: 100,
        paymentId: payment.id,
        orderId: order.id,
        bookedAt: savedBooking?.bookedAt || new Date(),
      },
    });
  } catch (error) {
    console.error('Demo payment verification failed:', error.message);

    return res.status(500).json({
      verified: false,
      message:
        'Unable to verify payment. Please contact support before retrying.',
    });
  }
});

router.get('/my-demo-bookings', protect, async (req, res) => {
  if (!isStudent(req)) {
    return res.status(403).json({
      message: 'Only student accounts can view demo bookings.',
    });
  }

  try {
    const bookings = (req.user.demoBookings || [])
      .filter((booking) => booking.paymentStatus === 'paid')
      .map((booking) => ({
        _id: booking._id,
        title: booking.title || 'Demo Class Booking',
        bookingType: booking.bookingType || 'demo',
        phone: booking.phone,
        paymentStatus: booking.paymentStatus,
        amountRupees: Number(booking.amount || DEMO_AMOUNT) / 100,
        paymentId: booking.paymentId,
        orderId: booking.orderId,
        bookedAt: booking.bookedAt,
        createdAt: booking.createdAt,
      }))
      .sort(
        (a, b) =>
          new Date(b.bookedAt || b.createdAt) -
          new Date(a.bookedAt || a.createdAt)
      );

    return res.json({ bookings });
  } catch (error) {
    console.error('Could not load demo bookings:', error.message);

    return res.status(500).json({
      message: 'Unable to load your demo bookings right now.',
    });
  }
});

/*
|--------------------------------------------------------------------------
| COURSE ENROLLMENT PAYMENT
|--------------------------------------------------------------------------
| POST /api/payment/create-order
| POST /api/payment/verify
| GET  /api/payment/my-courses
*/

router.post('/create-order', protect, async (req, res) => {
  if (!isStudent(req)) {
    return res.status(403).json({
      message: 'Only student accounts can purchase courses.',
    });
  }

  try {
    const {
      courseId,
      plan,
      duration,
      slotChoice,
      selectedDate,
      preferredDays = [],
    } = req.body;

    if (!validCourses.has(courseId)) {
      return res.status(400).json({
        message: 'Invalid course selected.',
      });
    }

    if (!Object.hasOwn(plans, plan)) {
      return res.status(400).json({
        message: 'Invalid plan selected.',
      });
    }

    if (!Object.hasOwn(discounts, duration)) {
      return res.status(400).json({
        message: 'Invalid enrollment duration.',
      });
    }

    if (!['own', 'assigned'].includes(slotChoice)) {
      return res.status(400).json({
        message: 'Invalid slot option.',
      });
    }

    if (!validDate(selectedDate)) {
      return res.status(400).json({
        message: 'Please select a valid starting date.',
      });
    }

    if (
      !Array.isArray(preferredDays) ||
      preferredDays.some((day) => !validDays.has(day)) ||
      new Set(preferredDays).size !== preferredDays.length
    ) {
      return res.status(400).json({
        message: 'Invalid preferred class days.',
      });
    }

    if (slotChoice === 'assigned' && preferredDays.length === 0) {
      return res.status(400).json({
        message: 'Select at least one preferred class day.',
      });
    }

    if (slotChoice === 'own' && preferredDays.length > 0) {
      return res.status(400).json({
        message:
          'Preferred class days are not used for a self-selected slot.',
      });
    }

    const amount = calculateAmount(plan, duration, slotChoice);
    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `ss_${Date.now()}_${crypto
        .randomBytes(3)
        .toString('hex')}`,
      notes: {
        courseId,
        plan,
        duration: String(duration),
        slotChoice,
        selectedDate,
        preferredDays: preferredDays.join(','),
        userId: String(req.user._id),
      },
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Course order creation failed:', error.message);

    return res.status(500).json({
      message: 'Unable to start payment. Please try again.',
    });
  }
});

router.post('/verify', protect, async (req, res) => {
  if (!isStudent(req)) {
    return res.status(403).json({
      message: 'Only student accounts can verify course purchases.',
    });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      return res.status(400).json({
        message: 'Payment signature verification failed.',
      });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (
      !order ||
      order.id !== razorpay_order_id ||
      order.currency !== 'INR' ||
      String(order.notes?.userId || '') !== String(req.user._id)
    ) {
      return res.status(400).json({
        message: 'Invalid payment order.',
      });
    }

    const {
      courseId,
      plan,
      duration,
      slotChoice,
    } = order.notes || {};

    const numericDuration = Number(duration);

    if (
      !validCourses.has(courseId) ||
      !Object.hasOwn(plans, plan) ||
      !Object.hasOwn(discounts, numericDuration) ||
      !['own', 'assigned'].includes(slotChoice) ||
      order.amount !== calculateAmount(
        plan,
        numericDuration,
        slotChoice
      )
    ) {
      return res.status(400).json({
        message: 'Order details could not be verified.',
      });
    }

    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== order.id ||
      payment.amount !== order.amount ||
      payment.currency !== 'INR' ||
      payment.status !== 'captured'
    ) {
      return res.status(400).json({
        message:
          'Payment is not confirmed as captured. Check your Razorpay dashboard.',
      });
    }

    const courseNames = {
      'soft-skills': 'Soft Skills',
      'interview-prep': 'Interview Preparation',
      'personality-dev': 'Personality Development',
      'adv-comm': 'Advanced Communication Skills',
      'spoken-english': 'Spoken English',
      'campus-readiness': 'Campus Readiness Training',
    };

    const alreadyPurchased = (req.user.purchasedCourses || []).some(
      (item) =>
        item.paymentId === payment.id ||
        item.orderId === order.id
    );

    if (!alreadyPurchased) {
      req.user.purchasedCourses.push({
        courseId,
        courseName: courseNames[courseId],
        plan,
        durationMonths: numericDuration,
        paymentId: payment.id,
        orderId: order.id,
        purchasedAt: new Date(),
        selectedDate: order.notes?.selectedDate || undefined,
        slotChoice,
        preferredDays: order.notes?.preferredDays
          ? String(order.notes.preferredDays)
              .split(',')
              .filter(Boolean)
          : [],
      });

      await req.user.save();
    }

    return res.json({
      verified: true,
      message: 'Payment verified and course enrollment saved successfully.',
      paymentId: payment.id,
      orderId: order.id,
      courseId,
      courseName: courseNames[courseId],
    });
  } catch (error) {
    console.error('Course payment verification failed:', error.message);

    return res.status(500).json({
      message:
        'Unable to verify payment. Please contact support before retrying.',
    });
  }
});

router.get('/my-courses', protect, async (req, res) => {
  if (!isStudent(req)) {
    return res.status(403).json({
      message: 'Only student accounts can view purchased courses.',
    });
  }

  try {
    return res.json({
      courses: (req.user.purchasedCourses || []).map((course) => ({
        id: course._id,
        courseId: course.courseId,
        courseName: course.courseName,
        plan: course.plan,
        durationMonths: course.durationMonths,
        purchasedAt: course.purchasedAt,
        selectedDate: course.selectedDate,
        slotChoice: course.slotChoice,
        preferredDays: course.preferredDays || [],
      })),
    });
  } catch (error) {
    console.error('Could not load purchased courses:', error.message);

    return res.status(500).json({
      message: 'Unable to load your courses right now.',
    });
  }
});

module.exports = router;
