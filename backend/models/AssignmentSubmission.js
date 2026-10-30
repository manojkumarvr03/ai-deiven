import mongoose from 'mongoose';

const rubricScoreSchema = new mongoose.Schema(
  {
    criteria: { type: String, required: true },
    awardedPoints: { type: Number, required: true },
    maxPoints: { type: Number, required: true },
    feedback: { type: String, default: '' }
  },
  { _id: false }
);

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    assignmentId: {
      type: String,
      required: true,
      index: true
    },
    assignmentCode: {
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
    codeSubmission: {
      type: String,
      default: ''
    },
    writtenSubmission: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 100
    },
    percentage: {
      type: Number,
      default: 0
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B', 'C', 'D', 'Needs Revision'],
      default: 'Needs Revision'
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'in-review'],
      default: 'graded'
    },
    aiFeedback: {
      type: String,
      default: ''
    },
    rubricBreakdown: [rubricScoreSchema],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

assignmentSubmissionSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

const AssignmentSubmission = mongoose.models.AssignmentSubmission || mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
export default AssignmentSubmission;
