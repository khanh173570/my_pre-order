// Simple admin creator
import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/preorder');
    console.log('Connected to MongoDB');

    const admin = await User.create({
      name: 'Test Admin',
      email: 'test-admin@gmail.com',
      password: 'admin123456',
      role: 'admin',
      isVerified: true
    });

    console.log('Admin created:', admin.email);
    console.log('Login: test-admin@gmail.com / admin123456');
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin already exists');
      // Update to verified
      await User.updateOne(
        { email: 'test-admin@gmail.com' },
        { isVerified: true }
      );
      console.log('Admin updated to verified status');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(0);
  }
}

createAdmin();
