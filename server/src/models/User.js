
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const purchasedCourseSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    plan: { type: String },
    durationMonths: { type: Number },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    purchasedAt: { type: Date, default: Date.now },
    selectedDate: { type: String },
    slotChoice: { type: String },
    preferredDays: [{ type: String }],
  },
  { _id: true }
);

const demoBookingSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    amount: { type: Number, required: true, default: 100 },
    currency: { type: String, default: 'INR' },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['paid'],
      default: 'paid',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    bookedAt: { type: Date, default: Date.now },
    preferredDays: {
      type: [String],
      default: ['Wednesday', 'Friday', 'Saturday'],
    },
  },
  { _id: true }
);

// NEW: Student wishlist course schema
const wishlistCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: { type: String, trim: true },
    college: { type: String, trim: true },

    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },

    accountType: {
      type: String,
      enum: ['student', 'corporate', 'college', 'school', 'admin'],
      default: 'student',
    },

    purchasedCourses: {
      type: [purchasedCourseSchema],
      default: [],
    },

    demoBookings: {
      type: [demoBookingSchema],
      default: [],
    },

    // NEW: Saved courses for later purchase
    wishlist: {
      type: [wishlistCourseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
