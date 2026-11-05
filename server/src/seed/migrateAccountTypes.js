require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  await connectDB();

  const [students, admins] = await Promise.all([
    User.updateMany(
      { role: { $ne: 'admin' }, $or: [{ accountType: { $exists: false } }, { accountType: null }] },
      { $set: { accountType: 'student' } }
    ),
    User.updateMany(
      { role: 'admin', accountType: { $ne: 'admin' } },
      { $set: { accountType: 'admin' } }
    ),
  ]);

  console.log(`Account-type migration complete: ${students.modifiedCount} student account(s), ${admins.modifiedCount} admin account(s).`);
  await mongoose.disconnect();
})().catch(async (error) => {
  console.error('Could not migrate account types:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
