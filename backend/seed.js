// This script seeds demo users for the clinic booking system.
// Usage: node backend/seed.js

const mongoose = require('mongoose');
const User = require('./src/models/User');
const config = require('./src/config/environment');

const MONGODB_URI = process.env.MONGODB_URI || config.mongodb_uri;

async function seedDemoUsers() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // First, delete existing demo users to avoid duplicates
  await User.deleteMany({ email: { $in: ['patient@test.com', 'doctor@test.com', 'admin@test.com'] } });

  const demoUsers = [
    {
      name: 'Demo Patient',
      email: 'patient@test.com',
      password: 'password', // Will be hashed by User model's pre-save hook
      phone: '9999999999',
      role: 'patient',
      isDeleted: false,
    },
    {
      name: 'Demo Doctor',
      email: 'doctor@test.com',
      password: 'password', // Will be hashed by User model's pre-save hook
      phone: '8888888888',
      role: 'doctor',
      isDeleted: false,
    },
    {
      name: 'Demo Admin',
      email: 'admin@test.com',
      password: 'password', // Will be hashed by User model's pre-save hook
      phone: '7777777777',
      role: 'admin',
      isDeleted: false,
    },
  ];

  for (const demo of demoUsers) {
    await User.create(demo);
    console.log(`Created user: ${demo.email}`);
  }

  await mongoose.disconnect();
  console.log('Demo users seeded successfully!');
}

seedDemoUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
