import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edura_ai');
    console.log('[MongoDB Connected]');

    const ADMIN_EMAIL = 'admin@edura.ai';
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log(`[Admin already exists]: ${ADMIN_EMAIL}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      await User.create({
        name: 'Edura Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        isActive: false,
        lastLogin: null
      });
      console.log(`[Admin Created]: ${ADMIN_EMAIL} / Admin@123`);
    }

    await mongoose.disconnect();
    console.log('[Done]');
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
};

seed();
