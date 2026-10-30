import mongoose from 'mongoose';

const testCaseResultSchema = new mongoose.Schema(
  {
    input: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    actualOutput: { type: String, default: '' },
    passed: { type: Boolean, default: false },
    error: { type: String, default: '' }
  },
  { _id: false }
);

const taskSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    taskId: {
      type: String,
      required: true,
      index: true
    },
    taskCode: {
      type: String,
      required: true
    },
    studyRole: {
      type: String,
      enum: ['school', 'college', 'diploma', 'programming'],
      required: true
    },
    courseId: {
      type: String,
      required: true
    },
    solutionCode: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'python'
    },
    status: {
      type: String,
      enum: ['solved', 'attempted', 'failed'],
      default: 'attempted'
    },
    passedTestCases: {
      type: Number,
      default: 0
    },
    totalTestCases: {
      type: Number,
      default: 0
    },
    testResults: [testCaseResultSchema],
    xpEarned: {
      type: Number,
      default: 0
    },
    attemptsCount: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

taskSubmissionSchema.index({ userId: 1, taskId: 1 }, { unique: true });

const TaskSubmission = mongoose.models.TaskSubmission || mongoose.model('TaskSubmission', taskSubmissionSchema);
export default TaskSubmission;
