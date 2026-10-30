import mongoose from 'mongoose';

const rubricItemSchema = new mongoose.Schema(
  {
    criteria: { type: String, required: true },
    maxPoints: { type: Number, required: true },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const evaluationRuleSchema = new mongoose.Schema(
  {
    testName: { type: String, required: true },
    weight: { type: Number, default: 25 },
    checkType: {
      type: String,
      enum: ['keyword', 'regex', 'execution', 'length', 'structural'],
      default: 'keyword'
    },
    pattern: { type: String, default: '' },
    feedback: { type: String, default: '' }
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
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
    moduleLevel: {
      type: Number,
      default: 1
    },
    category: {
      type: String,
      required: true
    },
    totalPoints: {
      type: Number,
      default: 100
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    estimatedDays: {
      type: Number,
      default: 3
    },
    dueDateDays: {
      type: Number,
      default: 7
    },
    description: {
      type: String,
      required: true
    },
    problemStatement: {
      type: String,
      required: true
    },
    learningObjectives: [{ type: String }],
    deliverables: [{ type: String }],
    submissionType: {
      type: String,
      enum: ['code', 'written', 'hybrid'],
      default: 'hybrid'
    },
    starterTemplate: {
      code: { type: String, default: '' },
      writtenTemplate: { type: String, default: '' }
    },
    rubric: [rubricItemSchema],
    evaluationRules: [evaluationRuleSchema],
    sampleSolution: {
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

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
export default Assignment;
