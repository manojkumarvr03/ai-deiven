import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { seedEducationDatabase } from './seedEducation.js';
import { seedTasksAndAssignmentsDatabase } from './seedTasksAndAssignments.js';

// In-memory user & education store fallback if MongoDB server is not locally running
export const inMemoryStore = {
  users: [],
  courses: [],
  progressList: [],
  assessments: [],
  activityLogs: [],
  tasks: [],
  taskSubmissions: [],
  assignments: [],
  assignmentSubmissions: [],
  isInMemory: false
};

// Seed default admin into the in-memory store
export const seedAdminUser = async () => {
  const ADMIN_EMAIL = 'admin@edura.ai';
  const ADMIN_PASSWORD = 'Admin@123';
  const existing = inMemoryStore.users.find(u => u.email === ADMIN_EMAIL);
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
    inMemoryStore.users.push({
      _id: 'admin_001',
      firstName: 'Edura',
      name: 'Edura Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      studyRole: 'programming',
      onboardingCompleted: true,
      isActive: false,
      lastLogin: null,
      createdAt: new Date()
    });
    console.log(`[Admin Seeded]: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edura_ai', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    inMemoryStore.isInMemory = false;
    await seedEducationDatabase();
    await seedTasksAndAssignmentsDatabase();
  } catch (error) {
    console.warn(`[MongoDB Warning]: Local MongoDB connection failed (${error.message}).`);
    console.warn(`[System Note]: Switching to High-Speed In-Memory DB Mode so authentication and APIs work seamlessly!`);
    inMemoryStore.isInMemory = true;
    await seedAdminUser();
    await seedEducationDatabase();
    await seedTasksAndAssignmentsDatabase();
  }
};

export default connectDB;
