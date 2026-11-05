const mongoose = require('mongoose');
const dns = require('node:dns');

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/success_scholar';

  // Some network DNS resolvers refuse SRV queries used by mongodb+srv URIs.
  // Allow an explicit resolver override while keeping the system default otherwise.
  const dnsServers = process.env.MONGODB_DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);
  if (dnsServers?.length) dns.setServers(dnsServers);

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};
