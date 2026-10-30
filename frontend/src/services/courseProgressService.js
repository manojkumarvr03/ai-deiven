// Real-time Course Progress Service (20 Lessons per Course Standard)
import API from './api';

const BASE_STORAGE_KEY = 'learnify_course_progress_v4';

// Returns a user-specific storage key so each account has isolated progress.
const getStorageKey = () => {
  try {
    const raw = localStorage.getItem('edura_user');
    if (raw) {
      const user = JSON.parse(raw);
      const uid = user?._id || user?.id || user?.email;
      if (uid) return `${BASE_STORAGE_KEY}_${uid}`;
    }
  } catch (_) {}
  return BASE_STORAGE_KEY;
};

const INITIAL_CLEAN_PROGRESS = {
  'ui-ux': {
    courseId: 'ui-ux',
    courseTitle: 'UI/UX Design Masterclass',
    category: 'Design',
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    assessmentScores: {},
    mcqCompleted: false,
    lastAccessed: new Date().toISOString()
  },
  'react-dev': {
    courseId: 'react-dev',
    courseTitle: 'React Development',
    category: 'Development',
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    assessmentScores: {},
    mcqCompleted: false,
    lastAccessed: new Date().toISOString()
  },
  'python-data': {
    courseId: 'python-data',
    courseTitle: 'Python for Data Science & AI',
    category: 'Data Science',
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    assessmentScores: {},
    mcqCompleted: false,
    lastAccessed: new Date().toISOString()
  },
  'content-strat': {
    courseId: 'content-strat',
    courseTitle: 'Content Strategy & Technical Writing',
    category: 'Design',
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    assessmentScores: {},
    mcqCompleted: false,
    lastAccessed: new Date().toISOString()
  }
};

export const isCourseMcqCompleted = (courseProgress) => {
  if (!courseProgress) return false;
  return Boolean(
    courseProgress.mcqCompleted ||
    courseProgress.aiAssessment?.score !== undefined ||
    (courseProgress.completedLessons && courseProgress.completedLessons.length > 0)
  );
};

// Earlier local progress records marked Level 1 as completed by default.
// Level 1 is available from the start, but it is only completed after the
// learner finishes it. Normalize that old empty-progress state once.
const normalizeLegacyProgress = (courseProgress) => {
  const hasOnlyDefaultLevelOne = Array.isArray(courseProgress?.completedLevels) &&
    courseProgress.completedLevels.length === 1 &&
    courseProgress.completedLevels[0] === 1;
  const hasNoCompletedLessons = !courseProgress?.completedLessons?.length;
  const hasNoAssessment = courseProgress?.aiAssessment?.score === undefined &&
    courseProgress?.aiAssessment?.completed !== true;

  if (hasOnlyDefaultLevelOne && hasNoCompletedLessons && hasNoAssessment) {
    return { ...courseProgress, completedLevels: [] };
  }

  return courseProgress;
};

export const getStoredProgress = () => {
  try {
    const STORAGE_KEY = getStorageKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLEAN_PROGRESS));
      return INITIAL_CLEAN_PROGRESS;
    }
    const stored = JSON.parse(raw);
    let migrated = false;
    const normalized = Object.fromEntries(
      Object.entries(stored).map(([courseId, courseProgress]) => {
        const updatedProgress = normalizeLegacyProgress(courseProgress);
        migrated ||= updatedProgress !== courseProgress;
        return [courseId, updatedProgress];
      })
    );

    if (migrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch (e) {
    return INITIAL_CLEAN_PROGRESS;
  }
};

export const resetProgressToClean = () => {
  const STORAGE_KEY = getStorageKey();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLEAN_PROGRESS));

  // Clean up any other versioned keys for this user only
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('learnify_course_progress') && k !== STORAGE_KEY) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {}

  window.dispatchEvent(new Event('learnify_progress_updated'));
  window.dispatchEvent(new CustomEvent('learnify_progress_updated', {
    detail: { reset: true }
  }));

  // Also call backend reset endpoint
  API.post('/progress/reset').catch(() => {});

  return INITIAL_CLEAN_PROGRESS;
};

export const saveCourseProgress = (courseId, progressData) => {
  try {
    const STORAGE_KEY = getStorageKey();
    const all = getStoredProgress();
    all[courseId] = {
      ...all[courseId],
      ...progressData,
      lastAccessed: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('learnify_progress_updated'));
    return all[courseId];
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

export const completeLessonRealtime = (courseId, lessonId, totalLessons = 20) => {
  const STORAGE_KEY = getStorageKey();
  const all = getStoredProgress();
  const current = all[courseId] || {
    courseId,
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    assessmentScores: {}
  };

  const completed = new Set(current.completedLessons || []);
  completed.add(lessonId);

  const updatedLessons = Array.from(completed);
  const percentage = Math.min(100, Math.round((updatedLessons.length / totalLessons) * 100));

  const updated = {
    ...current,
    totalLessons,
    completedLessons: updatedLessons,
    progressPercentage: percentage,
    lastAccessed: new Date().toISOString()
  };

  all[courseId] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Dispatch custom event for real-time reactivity across all components
  window.dispatchEvent(new CustomEvent('learnify_progress_updated', {
    detail: { courseId, lessonId, percentage, totalCompleted: updatedLessons.length }
  }));

  // Asynchronously notify backend API
  API.post('/progress/level/complete', {
    courseId,
    level: current.currentLevel || 1,
    lessonId
  }).catch(() => {});

  return updated;
};

export const saveAiAssessment = (courseId, assessmentData) => {
  try {
    const STORAGE_KEY = getStorageKey();
    const all = getStoredProgress();
    const current = all[courseId] || {
      courseId,
      totalLessons: 20,
      completedLessons: [],
      completedLevels: [],
      currentLevel: 1,
      assessmentScores: {}
    };

    const updated = {
      ...current,
      mcqCompleted: true,
      aiAssessment: {
        ...assessmentData,
        completed: true,
        updatedAt: new Date().toISOString()
      },
      lastAccessed: new Date().toISOString()
    };

    all[courseId] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('learnify_progress_updated', {
      detail: { courseId, aiAssessment: updated.aiAssessment, mcqCompleted: true }
    }));
    return updated;
  } catch (e) {
    console.error('Error saving AI assessment:', e);
  }
};

export const batchCompleteLessons = (courseId, lessonIds, totalLessons = 20) => {
  const STORAGE_KEY = getStorageKey();
  const all = getStoredProgress();
  const current = all[courseId] || {
    courseId,
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    assessmentScores: {}
  };

  const completed = new Set(current.completedLessons || []);
  lessonIds.forEach(id => completed.add(id));

  const updatedLessons = Array.from(completed);
  const percentage = Math.min(100, Math.round((updatedLessons.length / totalLessons) * 100));

  const updated = {
    ...current,
    totalLessons,
    completedLessons: updatedLessons,
    progressPercentage: percentage,
    lastAccessed: new Date().toISOString()
  };

  all[courseId] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  window.dispatchEvent(new CustomEvent('learnify_progress_updated', {
    detail: { courseId, percentage, totalCompleted: updatedLessons.length }
  }));

  return updated;
};

export const applyAiFastTrackProgress = (
  courseId,
  fastTrackLessonIds = [],
  completedLevels = [1],
  recommendedStartLevel = 2,
  assessmentData = null
) => {
  const STORAGE_KEY = getStorageKey();
  const all = getStoredProgress();
  const current = all[courseId] || {
    courseId,
    totalLessons: 20,
    completedLessons: [],
    completedLevels: [],
    currentLevel: 1,
    unlockedLevel: 1,
    assessmentScores: {}
  };

  const completedLessonsSet = new Set(current.completedLessons || []);
  if (fastTrackLessonIds && fastTrackLessonIds.length > 0) {
    fastTrackLessonIds.forEach(id => completedLessonsSet.add(id));
  }

  const updatedCompletedLessons = Array.from(completedLessonsSet);
  const total = current.totalLessons || 20;
  const percentage = Math.min(100, Math.round((updatedCompletedLessons.length / total) * 100));

  const updatedLevelsSet = new Set(current.completedLevels || []);
  completedLevels.forEach(lvl => updatedLevelsSet.add(lvl));

  const updated = {
    ...current,
    mcqCompleted: true,
    totalLessons: total,
    completedLessons: updatedCompletedLessons,
    completedLevels: Array.from(updatedLevelsSet),
    currentLevel: Math.max(current.currentLevel || 1, recommendedStartLevel),
    unlockedLevel: Math.max(current.unlockedLevel || 1, recommendedStartLevel),
    progressPercentage: percentage,
    aiAssessment: assessmentData ? { ...assessmentData, completed: true, updatedAt: new Date().toISOString() } : current.aiAssessment,
    lastAccessed: new Date().toISOString()
  };

  all[courseId] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Trigger cross-component reactive update
  window.dispatchEvent(new CustomEvent('learnify_progress_updated', {
    detail: {
      courseId,
      percentage,
      completedLevels: updated.completedLevels,
      currentLevel: updated.currentLevel,
      totalCompleted: updatedCompletedLessons.length,
      aiAssessment: updated.aiAssessment
    }
  }));

  // Sync to backend
  API.post('/progress/level/complete', {
    courseId,
    level: Math.max(1, recommendedStartLevel - 1),
    directScore: assessmentData?.score || 100
  }).catch(() => {});

  return updated;
};
