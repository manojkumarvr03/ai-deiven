import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

dotenv.config();

const app = express();

// Connect to Database & Seed Initial Education Data
connectDB();

// Middleware
const allowedOrigins = [
  'https://fluffy-eclair-978e8b.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AI-Driven Educational Recommendation & Analytics Backend',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assignments', assignmentRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` EDURA AI BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
