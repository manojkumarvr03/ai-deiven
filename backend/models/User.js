import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your first name'],
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    studyRole: {
      type: String,
      enum: ['school', 'college', 'diploma', 'programming'],
      default: 'school'
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    selectedCourseId: {
      type: String,
      default: ''
    },
    selectedPath: {
      type: String,
      default: ''
    },
    educationLevel: {
      type: String,
      enum: ['Primary', 'Middle School', 'Secondary', 'Undergraduate', 'Postgraduate', 'Diploma', 'Professional', 'Other'],
      default: 'Undergraduate'
    },
    course: {
      type: String,
      default: ''
    },
    institution: {
      type: String,
      default: 'Edura Academy'
    },
    learningInterests: {
      type: [String],
      default: ['Programming', 'Computer Science']
    },
    preferredLearningStyle: {
      type: String,
      enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'],
      default: 'Visual'
    },
    avatar: {
      type: String,
      default: ''
    },
    learningStats: {
      overallScore: { type: Number, default: 0 },
      streakDays: { type: Number, default: 1 },
      studyHours: { type: Number, default: 0 },
      completedCourses: { type: Number, default: 0 },
      totalXP: { type: Number, default: 50 },
      riskLevel: { type: String, enum: ['Low Risk', 'Moderate Risk', 'High Risk'], default: 'Low Risk' }
    },
    weakTopics: {
      type: [String],
      default: []
    },
    strongTopics: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to populate name from firstName and hash password
userSchema.pre('save', async function (next) {
  if (!this.name && this.firstName) {
    this.name = this.firstName;
  }
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
