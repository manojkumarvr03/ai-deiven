import EducationCourse from '../models/EducationCourse.js';
import { inMemoryStore } from '../config/db.js';

export const EDUCATION_PATHS_META = [
  {
    id: 'design',
    title: 'UI/UX & Product Design',
    subtitle: 'Wireframing, Design Systems & Figma',
    description: 'Master digital product design, user research, Figma Auto-Layout, design tokens, and interactive micro-animations.',
    icon: '🎨',
    badge: 'Design'
  },
  {
    id: 'development',
    title: 'Modern Full-Stack Development',
    subtitle: 'React, Next.js, Node.js & TypeScript',
    description: 'Build enterprise-grade web applications, REST APIs, Microservices, and scalable cloud architectures.',
    icon: '💻',
    badge: 'Engineering'
  },
  {
    id: 'data_science',
    title: 'Data Science & Artificial Intelligence',
    subtitle: 'Python, NumPy, Scikit-Learn & Deep Learning',
    description: 'From statistical data wrangling with Pandas to Machine Learning models, Neural Networks, and AI deployment.',
    icon: '📊',
    badge: 'AI & Data'
  }
];

// @desc    Get all available education paths
// @route   GET /api/education/paths
// @access  Public / Private
export const getEducationPaths = async (req, res) => {
  try {
    return res.json({
      success: true,
      paths: EDUCATION_PATHS_META
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving education paths' });
  }
};

// @desc    Get courses for a specific studyRole (or all)
// @route   GET /api/education/courses?studyRole=...
// @access  Public / Private
export const getCourses = async (req, res) => {
  try {
    const { studyRole } = req.query;
    const filter = studyRole ? { studyRole } : {};

    if (inMemoryStore.isInMemory) {
      let results = inMemoryStore.courses;
      if (studyRole) {
        results = results.filter(c => c.studyRole === studyRole);
      }
      results.sort((a, b) => (a.order || 1) - (b.order || 1));
      return res.json({
        success: true,
        count: results.length,
        courses: results
      });
    }

    const courses = await EducationCourse.find(filter).sort({ order: 1, createdAt: 1 });
    return res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get Courses Error:', error);
    return res.status(500).json({ message: 'Error retrieving courses' });
  }
};

// @desc    Get course by code or ID with full modules
// @route   GET /api/education/course/:idOrCode
// @access  Private
export const getCourseByCodeOrId = async (req, res) => {
  try {
    const { idOrCode } = req.params;

    if (inMemoryStore.isInMemory) {
      const course = inMemoryStore.courses.find(c => c.code === idOrCode || c._id === idOrCode || c.id === idOrCode);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      return res.json({ success: true, course });
    }

    let course = await EducationCourse.findOne({ code: idOrCode });
    if (!course && idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      course = await EducationCourse.findById(idOrCode);
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get Course Detail Error:', error);
    return res.status(500).json({ message: 'Error retrieving course details' });
  }
};
