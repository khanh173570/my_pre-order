import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function testRoleUpdate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Tìm user có role staff
    const staffUser = await User.findOne({ role: 'staff' });
    if (!staffUser) {
      console.log('No staff user found');
      return;
    }

    console.log('Before update:', staffUser.role);

    // Thử update role từ staff xuống user
    const updatedUser = await User.findByIdAndUpdate(
      staffUser._id,
      { role: 'user' },
      { new: true, runValidators: true }
    );

    console.log('After update:', updatedUser.role);
    console.log('Success!');

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testRoleUpdate();
