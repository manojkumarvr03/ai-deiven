import User from '../models/User.js';
import { inMemoryStore } from '../config/db.js';

const VALID_STUDY_ROLES = ['school', 'college', 'diploma', 'programming'];

// @desc    Update student study role from Settings without losing past progress
// @route   PUT /api/users/study-role
// @access  Private
export const updateStudyRole = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    const { studyRole, selectedCourseId } = req.body;

    if (!studyRole || !VALID_STUDY_ROLES.includes(studyRole)) {
      return res.status(400).json({
        message: 'Invalid study role. Allowed options: school, college, diploma, programming'
      });
    }

    if (inMemoryStore.isInMemory) {
      const user = inMemoryStore.users.find(u => (u._id || u.id).toString() === userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.studyRole = studyRole;
      if (selectedCourseId) user.selectedCourseId = selectedCourseId;
      user.selectedPath = studyRole;

      const { password: _, ...userWithoutPass } = user;
      return res.json({
        success: true,
        message: `Study role successfully changed to ${studyRole.toUpperCase()}. Your past learning history is safely preserved!`,
        user: userWithoutPass
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        studyRole,
        selectedPath: studyRole,
        ...(selectedCourseId ? { selectedCourseId } : {})
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      success: true,
      message: `Study role successfully changed to ${studyRole.toUpperCase()}. Your past learning history is safely preserved!`,
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName || updatedUser.name,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studyRole: updatedUser.studyRole,
        onboardingCompleted: updatedUser.onboardingCompleted,
        selectedCourseId: updatedUser.selectedCourseId,
        educationLevel: updatedUser.educationLevel,
        course: updatedUser.course
      }
    });
  } catch (error) {
    console.error('Update Study Role Error:', error);
    return res.status(500).json({ message: 'Error updating study role' });
  }
};

// @desc    Get complete user profile with progress stats
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc    Update editable profile preferences
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id || '').toString();
    const { firstName, institution, preferredLearningStyle } = req.body;
    const updates = {};

    if (firstName !== undefined) {
      const cleanFirstName = String(firstName).trim();
      if (!cleanFirstName) {
        return res.status(400).json({ message: 'Display name cannot be empty' });
      }
      if (cleanFirstName.length > 80) {
        return res.status(400).json({ message: 'Display name must be 80 characters or fewer' });
      }
      updates.firstName = cleanFirstName;
      updates.name = cleanFirstName;
    }

    if (institution !== undefined) {
      const cleanInstitution = String(institution).trim();
      if (cleanInstitution.length > 120) {
        return res.status(400).json({ message: 'Institution must be 120 characters or fewer' });
      }
      updates.institution = cleanInstitution;
    }

    if (preferredLearningStyle !== undefined) {
      const validLearningStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'];
      if (!validLearningStyles.includes(preferredLearningStyle)) {
        return res.status(400).json({ message: 'Invalid preferred learning style' });
      }
      updates.preferredLearningStyle = preferredLearningStyle;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No profile changes were provided' });
    }

    let updatedUser;
    if (inMemoryStore.isInMemory) {
      const index = inMemoryStore.users.findIndex((user) => (user._id || user.id).toString() === userId);
      if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      Object.assign(inMemoryStore.users[index], updates);
      updatedUser = inMemoryStore.users[index];
    } else {
      updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true
      }).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const { password, ...safeUser } = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};
