import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    explanation: { type: String, default: '' },
    isHidden: { type: Boolean, default: false }
  },
  { _id: false }
);

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
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
    category: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    xpReward: {
      type: Number,
      default: 50
    },
    estimatedMinutes: {
      type: Number,
      default: 15
    },
    description: {
      type: String,
      required: true
    },
    examples: [exampleSchema],
    constraints: [{ type: String }],
    starterCode: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      enum: ['python', 'javascript', 'cpp', 'java', 'sql', 'math', 'text'],
      default: 'python'
    },
    testCases: [testCaseSchema],
    hints: [{ type: String }],
    aiGuidance: {
      type: String,
      default: ''
    },
    solutionSnippet: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
