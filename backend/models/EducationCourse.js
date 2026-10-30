import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: String, default: '15 mins' },
  keyPoints: [{ type: String }]
}, { _id: false });

const moduleSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  lessons: [lessonSchema],
  assessment: {
    title: { type: String, default: 'Level Assessment Quiz' },
    passingScore: { type: Number, default: 60 },
    questions: [questionSchema]
  }
}, { _id: false });

const educationCourseSchema = new mongoose.Schema(
  {
    studyRole: {
      type: String,
      enum: ['school', 'college', 'diploma', 'programming', 'design', 'development', 'data_science'],
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📚'
    },
    estimatedHours: {
      type: Number,
      default: 20
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner'
    },
    order: {
      type: Number,
      default: 1
    },
    modules: [moduleSchema]
  },
  {
    timestamps: true
  }
);

const EducationCourse = mongoose.models.EducationCourse || mongoose.model('EducationCourse', educationCourseSchema);
export default EducationCourse;
