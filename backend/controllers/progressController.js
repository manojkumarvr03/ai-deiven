import Progress from '../models/Progress.js';
import EducationCourse from '../models/EducationCourse.js';
import { inMemoryStore } from '../config/db.js';

// Helper to fetch course definition
const findCourse = async (courseId) => {
  if (inMemoryStore.isInMemory) {
    return inMemoryStore.courses.find(c => c.code === courseId || c._id === courseId || c.id === courseId);
  }
  let course = await EducationCourse.findOne({ code: courseId });
  if (!course && courseId.match(/^[0-9a-fA-F]{24}$/)) {
    course = await EducationCourse.findById(courseId);
  }
  return course;
};

// @desc    Get progress for a specific course
// @route   GET /api/progress/:courseId
// @access  Private
export const getProgressByCourse = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    const { courseId } = req.params;

    const courseObj = await findCourse(courseId);
    const courseTitle = courseObj ? courseObj.title : courseId;
    const studyRole = courseObj ? courseObj.studyRole : (req.user.studyRole || 'school');

    if (inMemoryStore.isInMemory) {
      let record = inMemoryStore.progressList.find(p => p.userId === userId && p.courseId === courseId);
      if (!record) {
        record = {
          _id: 'prog_' + Date.now(),
          userId,
          studyRole,
          courseId,
          courseTitle,
          unlockedLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          completedLessons: [],
          assessmentScores: {},
          progressPercentage: 0,
          status: 'unlocked',
          startedAt: new Date(),
          updatedAt: new Date()
        };
        inMemoryStore.progressList.push(record);
      }
      return res.json({ success: true, progress: record, course: courseObj });
    }

    let record = await Progress.findOne({ userId, courseId });
    if (!record) {
      record = await Progress.create({
        userId,
        studyRole,
        courseId,
        courseTitle,
        unlockedLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        completedLessons: [],
        assessmentScores: {},
        progressPercentage: 0,
        status: 'unlocked'
      });
    }

    return res.json({
      success: true,
      progress: record,
      course: courseObj
    });
  } catch (error) {
    console.error('Get Progress Error:', error);
    return res.status(500).json({ message: 'Error retrieving course progress' });
  }
};

// @desc    Get all learning progress records for current user
// @route   GET /api/progress
// @access  Private
export const getAllProgress = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();

    if (inMemoryStore.isInMemory) {
      const records = inMemoryStore.progressList.filter(p => p.userId === userId);
      return res.json({ success: true, count: records.length, progress: records });
    }

    const records = await Progress.find({ userId }).sort({ updatedAt: -1 });
    return res.json({ success: true, count: records.length, progress: records });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving learning records' });
  }
};

// @desc    Start/Enter a course level
// @route   POST /api/progress/start
// @access  Private
export const startLevel = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    const { courseId, level } = req.body;
    const requestedLevel = parseInt(level, 10) || 1;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    let record = null;
    if (inMemoryStore.isInMemory) {
      record = inMemoryStore.progressList.find(p => p.userId === userId && p.courseId === courseId);
      if (!record) {
        const courseObj = inMemoryStore.courses.find(c => c.code === courseId);
        record = {
          _id: 'prog_' + Date.now(),
          userId,
          studyRole: courseObj?.studyRole || req.user.studyRole || 'school',
          courseId,
          courseTitle: courseObj?.title || courseId,
          unlockedLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          completedLessons: [],
          assessmentScores: {},
          progressPercentage: 0,
          status: 'in-progress',
          startedAt: new Date()
        };
        inMemoryStore.progressList.push(record);
      }
    } else {
      record = await Progress.findOne({ userId, courseId });
      if (!record) {
        const courseObj = await EducationCourse.findOne({ code: courseId });
        record = await Progress.create({
          userId,
          studyRole: courseObj?.studyRole || req.user.studyRole || 'school',
          courseId,
          courseTitle: courseObj?.title || courseId,
          unlockedLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          completedLessons: [],
          assessmentScores: {},
          progressPercentage: 0,
          status: 'in-progress'
        });
      }
    }

    // Backend validation: Course Level Unlock Check
    if (requestedLevel > record.unlockedLevel) {
      return res.status(403).json({
        success: false,
        message: `Level ${requestedLevel} is locked. Complete Level ${record.unlockedLevel} assessment first to unlock.`
      });
    }

    record.currentLevel = requestedLevel;
    if (record.status === 'unlocked') record.status = 'in-progress';

    if (!inMemoryStore.isInMemory) {
      await record.save();
    }

    return res.json({
      success: true,
      message: `Started Level ${requestedLevel}`,
      progress: record
    });
  } catch (error) {
    console.error('Start Level Error:', error);
    return res.status(500).json({ message: 'Error accessing level' });
  }
};

// @desc    Submit assessment and validate score to unlock next level
// @route   POST /api/progress/complete
// @access  Private
export const completeAssessmentAndUnlock = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    const { courseId, level, answers, directScore } = req.body;
    const currentLevel = parseInt(level, 10) || 1;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // 1. Fetch Course Definitions & Assessment Questions
    const course = await findCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const moduleObj = course.modules?.find(m => m.level === currentLevel);
    if (!moduleObj) {
      return res.status(404).json({ message: `Module level ${currentLevel} not found in course curriculum` });
    }

    const assessment = moduleObj.assessment;
    const passingScore = assessment?.passingScore || 60;
    const questions = assessment?.questions || [];

    // 2. Compute Score
    let calculatedScore = 0;
    if (typeof directScore === 'number') {
      calculatedScore = Math.min(100, Math.max(0, directScore));
    } else if (questions.length > 0 && answers) {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        const studentAns = answers[q.id] !== undefined ? answers[q.id] : answers[idx];
        if (studentAns === q.correctIndex) {
          correctCount++;
        }
      });
      calculatedScore = Math.round((correctCount / questions.length) * 100);
    } else {
      calculatedScore = 100; // Default if lesson without questions
    }

    // 3. Retrieve or create Progress
    let record = null;
    if (inMemoryStore.isInMemory) {
      record = inMemoryStore.progressList.find(p => p.userId === userId && p.courseId === courseId);
      if (!record) {
        record = {
          _id: 'prog_' + Date.now(),
          userId,
          studyRole: course.studyRole,
          courseId,
          courseTitle: course.title,
          unlockedLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          completedLessons: [],
          assessmentScores: {},
          progressPercentage: 0,
          status: 'in-progress'
        };
        inMemoryStore.progressList.push(record);
      }
    } else {
      record = await Progress.findOne({ userId, courseId });
      if (!record) {
        record = await Progress.create({
          userId,
          studyRole: course.studyRole,
          courseId,
          courseTitle: course.title,
          unlockedLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          completedLessons: [],
          assessmentScores: {},
          progressPercentage: 0,
          status: 'in-progress'
        });
      }
    }

    // Backend validation: Student cannot submit assessment for locked levels
    if (currentLevel > record.unlockedLevel) {
      return res.status(403).json({
        success: false,
        message: 'Cannot submit assessment for a locked level'
      });
    }

    // Update Assessment Scores map
    if (inMemoryStore.isInMemory) {
      record.assessmentScores[currentLevel.toString()] = calculatedScore;
    } else {
      record.assessmentScores.set(currentLevel.toString(), calculatedScore);
    }

    const hasPassed = calculatedScore >= passingScore;

    if (!hasPassed) {
      if (!inMemoryStore.isInMemory) await record.save();
      return res.json({
        success: true,
        passed: false,
        score: calculatedScore,
        passingScore,
        message: `You scored ${calculatedScore}%. A minimum of ${passingScore}% is required to unlock the next level.`,
        remedy: 'Review the lesson concepts and retake the assessment to proceed.'
      });
    }

    // Passed! Unlock next level
    if (!record.completedLevels.includes(currentLevel)) {
      record.completedLevels.push(currentLevel);
    }

    const totalModules = course.modules?.length || 1;
    const nextLevel = currentLevel + 1;
    const isNextAvailable = course.modules?.some(m => m.level === nextLevel);

    if (isNextAvailable) {
      record.unlockedLevel = Math.max(record.unlockedLevel, nextLevel);
      record.currentLevel = nextLevel;
    }

    record.progressPercentage = Math.round((record.completedLevels.length / totalModules) * 100);
    if (record.progressPercentage >= 100) {
      record.status = 'completed';
      record.completedAt = new Date();
    } else {
      record.status = 'in-progress';
    }

    if (!inMemoryStore.isInMemory) {
      await record.save();
    }

    return res.json({
      success: true,
      passed: true,
      score: calculatedScore,
      passingScore,
      unlockedLevel: record.unlockedLevel,
      nextLevel: isNextAvailable ? nextLevel : null,
      progressPercentage: record.progressPercentage,
      message: isNextAvailable
        ? `Congratulations! You scored ${calculatedScore}% and unlocked Level ${nextLevel}!`
        : `Outstanding! You have mastered all levels of ${course.title}!`,
      progress: record
    });
  } catch (error) {
    console.error('Complete Assessment Error:', error);
    return res.status(500).json({ message: error.message || 'Error processing assessment completion' });
  }
};

// @desc    Reset all progress for the current user
// @route   POST /api/progress/reset
// @access  Private
export const resetProgress = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    if (inMemoryStore.isInMemory) {
      inMemoryStore.progressList = inMemoryStore.progressList.filter(p => p.userId !== userId);
    } else {
      await Progress.deleteMany({ userId });
    }
    return res.json({ success: true, message: 'All course progress successfully reset to 0%' });
  } catch (error) {
    console.error('Reset Progress Error:', error);
    return res.status(500).json({ message: 'Error resetting progress data' });
  }
};

