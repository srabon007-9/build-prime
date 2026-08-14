const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Project = require('./models/Project');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

async function seed() {
  try {
    await Project.deleteMany({});
    await User.deleteOne({ email: 'admin@buildprime.com' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'BuildPrime Admin',
      email: 'admin@buildprime.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Seed complete: old projects removed and admin account created');
    console.log('Admin login: admin@buildprime.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
