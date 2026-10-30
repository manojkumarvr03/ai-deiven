import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { inMemoryStore } from '../config/db.js';

const VALID_STUDY_ROLES = ['school', 'college', 'diploma', 'programming'];

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      name,
      email,
      password,
      studyRole = 'school'
    } = req.body;

    const studentFirstName = (firstName || name || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!studentFirstName) {
      return res.status(400).json({ message: 'Please enter your first name' });
    }

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: 'Please provide both email address and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const validatedStudyRole = VALID_STUDY_ROLES.includes(studyRole) ? studyRole : 'school';

    // In-memory fallback mode
    if (inMemoryStore.isInMemory) {
      const existingUser = inMemoryStore.users.find(u => u.email === cleanEmail);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email address' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        firstName: studentFirstName,
        name: studentFirstName,
        email: cleanEmail,
        password: hashedPassword,
        role: 'student',
        studyRole: validatedStudyRole,
        onboardingCompleted: false,
        selectedCourseId: '',
        selectedPath: '',
        educationLevel: validatedStudyRole === 'school' ? 'Secondary' : (validatedStudyRole === 'diploma' ? 'Diploma' : 'Undergraduate'),
        course: '',
        institution: 'Edura Academy',
        learningInterests: ['Programming', 'Computer Science'],
        preferredLearningStyle: 'Visual',
        learningStats: {
          overallScore: 0,
          streakDays: 1,
          studyHours: 0,
          completedCourses: 0,
          totalXP: 50,
          riskLevel: 'Low Risk'
        },
        weakTopics: [],
        strongTopics: [],
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date()
      };

      inMemoryStore.users.push(newUser);

      const token = generateToken(newUser._id, newUser.role);
      const { password: _, ...userWithoutPass } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to Edura.AI',
        token,
        user: userWithoutPass
      });
    }

    // MongoDB Mode
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const user = await User.create({
      firstName: studentFirstName,
      name: studentFirstName,
      email: cleanEmail,
      password,
      role: 'student',
      studyRole: validatedStudyRole,
      onboardingCompleted: false,
      selectedCourseId: '',
      selectedPath: '',
      educationLevel: validatedStudyRole === 'school' ? 'Secondary' : (validatedStudyRole === 'diploma' ? 'Diploma' : 'Undergraduate'),
      course: '',
      institution: 'Edura Academy'
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to Edura.AI',
        token,
        user: {
          _id: user._id,
          firstName: user.firstName || user.name,
          name: user.name || user.firstName,
          email: user.email,
          role: user.role,
          studyRole: user.studyRole,
          onboardingCompleted: user.onboardingCompleted,
          selectedCourseId: user.selectedCourseId,
          selectedPath: user.selectedPath,
          educationLevel: user.educationLevel,
          course: user.course,
          institution: user.institution,
          learningStats: user.learningStats
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid registration details provided' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (inMemoryStore.isInMemory) {
      const user = inMemoryStore.users.find(u => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Track active session
      user.isActive = true;
      user.lastLogin = new Date();

      const token = generateToken(user._id, user.role);
      const { password: _, ...userWithoutPass } = user;

      return res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: userWithoutPass
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    // Track active session in MongoDB — use updateOne to avoid full validation re-run
    await User.findByIdAndUpdate(user._id, {
      isActive: true,
      lastLogin: new Date()
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName || user.name,
        name: user.name || user.firstName,
        email: user.email,
        role: user.role,
        studyRole: user.studyRole || 'school',
        onboardingCompleted: !!user.onboardingCompleted,
        selectedCourseId: user.selectedCourseId || '',
        selectedPath: user.selectedPath || '',
        educationLevel: user.educationLevel,
        course: user.course,
        institution: user.institution,
        learningInterests: user.learningInterests,
        preferredLearningStyle: user.preferredLearningStyle,
        learningStats: user.learningStats,
        weakTopics: user.weakTopics,
        strongTopics: user.strongTopics,
        isActive: true,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    if (inMemoryStore.isInMemory && req.user) {
      const user = inMemoryStore.users.find(u => u._id === req.user._id || u._id === req.user.id);
      if (user) user.isActive = false;
    } else if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { isActive: false });
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.json({ success: true, message: 'Logged out successfully' });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    if (inMemoryStore.isInMemory) {
      const users = inMemoryStore.users
        .filter(u => u.role !== 'admin')
        .map(({ password, ...u }) => u);
      return res.json({ success: true, users });
    }
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Delete user by admin
// @route   DELETE /api/auth/admin/users/:id
// @access  Admin
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (inMemoryStore.isInMemory) {
      const index = inMemoryStore.users.findIndex(u => u._id === id || u.id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (inMemoryStore.users[index].role === 'admin') {
        return res.status(403).json({ message: 'Cannot delete admin account' });
      }
      inMemoryStore.users.splice(index, 1);
      return res.json({ success: true, message: 'User deleted successfully' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin account' });
    }

    await User.findByIdAndDelete(id);
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ message: error.message || 'Error deleting user' });
  }
};
