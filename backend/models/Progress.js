import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    studyRole: {
      type: String,
      enum: ['school', 'college', 'diploma', 'programming'],
      required: true,
      index: true
    },
    courseId: {
      type: String,
      required: true,
      index: true
    },
    courseTitle: {
      type: String,
      default: ''
    },
    unlockedLevel: {
      type: Number,
      default: 1
    },
    currentLevel: {
      type: Number,
      default: 1
    },
    completedLevels: {
      type: [Number],
      default: []
    },
    completedLessons: {
      type: [String],
      default: []
    },
    assessmentScores: {
      type: Map,
      of: Number,
      default: {}
    },
    progressPercentage: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['locked', 'unlocked', 'in-progress', 'completed'],
      default: 'unlocked'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness of (userId + courseId)
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);
export default Progress;
