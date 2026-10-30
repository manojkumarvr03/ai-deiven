import User from '../models/User.js';
import Progress from '../models/Progress.js';
import EducationCourse from '../models/EducationCourse.js';
import { inMemoryStore } from '../config/db.js';

// @desc    Get student onboarding status
// @route   GET /api/onboarding/status
// @access  Private
export const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (inMemoryStore.isInMemory) {
      const user = inMemoryStore.users.find(u => u._id === userId || u.id === userId);
      return res.json({
        success: true,
        onboardingCompleted: !!user?.onboardingCompleted,
        studyRole: user?.studyRole || 'school',
        selectedCourseId: user?.selectedCourseId || ''
      });
    }

    const user = await User.findById(userId);
    return res.json({
      success: true,
      onboardingCompleted: !!user?.onboardingCompleted,
      studyRole: user?.studyRole || 'school',
      selectedCourseId: user?.selectedCourseId || ''
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking onboarding status' });
  }
};

// @desc    Complete onboarding by selecting learning path & initial course
// @route   POST /api/onboarding/complete
// @access  Private
export const completeOnboarding = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    const { studyRole, courseCode, educationLevel } = req.body;

    if (!courseCode) {
      return res.status(400).json({ message: 'Please select a course to continue' });
    }

    const validStudyRoles = ['school', 'college', 'diploma', 'programming'];
    const chosenRole = validStudyRoles.includes(studyRole) ? studyRole : (req.user.studyRole || 'school');

    // Fetch course details
    let courseObj = null;
    if (inMemoryStore.isInMemory) {
      courseObj = inMemoryStore.courses.find(c => c.code === courseCode);
    } else {
      courseObj = await EducationCourse.findOne({ code: courseCode });
    }

    const courseTitle = courseObj ? courseObj.title : courseCode;
    const initialEducationLevel = educationLevel || (courseObj ? courseObj.category : 'Undergraduate');

    // 1. In-Memory Store Logic
    if (inMemoryStore.isInMemory) {
      const user = inMemoryStore.users.find(u => (u._id || u.id).toString() === userId);
      if (user) {
        user.onboardingCompleted = true;
        user.studyRole = chosenRole;
        user.selectedCourseId = courseCode;
        user.selectedPath = chosenRole;
        user.educationLevel = initialEducationLevel;
        user.course = courseTitle;
      }

      // Initialize Progress record if not exists
      let progressRecord = inMemoryStore.progressList.find(p => p.userId === userId && p.courseId === courseCode);
      if (!progressRecord) {
        progressRecord = {
          _id: 'prog_' + Date.now(),
          userId,
          studyRole: chosenRole,
          courseId: courseCode,
          courseTitle,
          unlockedLevel: 1,
          currentLevel: 1,
          completedLevels: [],
          completedLessons: [],
          assessmentScores: {},
          progressPercentage: 0,
          status: 'in-progress',
          startedAt: new Date(),
          updatedAt: new Date()
        };
        inMemoryStore.progressList.push(progressRecord);
      }

      return res.json({
        success: true,
        message: 'Onboarding completed successfully! Your learning path is ready.',
        user: {
          _id: user?._id || userId,
          firstName: user?.firstName || user?.name,
          name: user?.name,
          email: user?.email,
          role: user?.role,
          studyRole: user?.studyRole,
          onboardingCompleted: true,
          selectedCourseId: courseCode,
          educationLevel: initialEducationLevel,
          course: courseTitle
        },
        progress: progressRecord
      });
    }

    // 2. MongoDB Logic
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        onboardingCompleted: true,
        studyRole: chosenRole,
        selectedCourseId: courseCode,
        selectedPath: chosenRole,
        educationLevel: initialEducationLevel,
        course: courseTitle
      },
      { new: true }
    );

    let progressRecord = await Progress.findOne({ userId, courseId: courseCode });
    if (!progressRecord) {
      progressRecord = await Progress.create({
        userId,
        studyRole: chosenRole,
        courseId: courseCode,
        courseTitle,
        unlockedLevel: 1,
        currentLevel: 1,
        completedLevels: [],
        completedLessons: [],
        assessmentScores: {},
        progressPercentage: 0,
        status: 'in-progress'
      });
    }

    return res.json({
      success: true,
      message: 'Onboarding completed successfully! Your learning path is ready.',
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName || updatedUser.name,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studyRole: updatedUser.studyRole,
        onboardingCompleted: true,
        selectedCourseId: updatedUser.selectedCourseId,
        educationLevel: updatedUser.educationLevel,
        course: updatedUser.course
      },
      progress: progressRecord
    });
  } catch (error) {
    console.error('Complete Onboarding Error:', error);
    return res.status(500).json({ message: error.message || 'Error completing onboarding' });
  }
};
