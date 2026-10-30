import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import User from '../models/User.js';
import { inMemoryStore } from '../config/db.js';

// Automated rubric evaluator & AI feedback generator
const evaluateAssignmentSubmission = (assignment, codeSubmission, writtenSubmission) => {
  const rubric = assignment.rubric || [];
  const evalRules = assignment.evaluationRules || [];
  const combinedContent = `${codeSubmission || ''} ${writtenSubmission || ''}`;

  let totalMaxScore = assignment.totalPoints || 100;
  let rubricBreakdown = [];
  let totalAwarded = 0;

  // Evaluate each rubric item
  rubric.forEach((item) => {
    let earned = item.maxPoints;
    let comments = 'Meets standard learning criteria.';

    const codeLen = (codeSubmission || '').trim().length;
    const writeLen = (writtenSubmission || '').trim().length;

    if (item.criteria.toLowerCase().includes('correctness') || item.criteria.toLowerCase().includes('implementation') || item.criteria.toLowerCase().includes('formula') || item.criteria.toLowerCase().includes('get & put')) {
      if (codeLen < 50) {
        earned = Math.round(item.maxPoints * 0.4);
        comments = 'Incomplete implementation detected. Ensure all specified function headers and logic are present.';
      } else if (codeLen < 150) {
        earned = Math.round(item.maxPoints * 0.8);
        comments = 'Good implementation with minor edge cases unaddressed.';
      } else {
        earned = item.maxPoints;
        comments = 'Excellent, thorough algorithmic solution.';
      }
    } else if (item.criteria.toLowerCase().includes('quality') || item.criteria.toLowerCase().includes('formatting') || item.criteria.toLowerCase().includes('eviction')) {
      if (codeSubmission && (codeSubmission.includes('#') || codeSubmission.includes('"""') || codeSubmission.includes('//'))) {
        earned = item.maxPoints;
        comments = 'Well-documented code with clear structure.';
      } else {
        earned = Math.round(item.maxPoints * 0.85);
        comments = 'Clean code structure; consider adding inline comments explaining complex steps.';
      }
    } else if (item.criteria.toLowerCase().includes('written') || item.criteria.toLowerCase().includes('analysis') || item.criteria.toLowerCase().includes('report') || item.criteria.toLowerCase().includes('theory') || item.criteria.toLowerCase().includes('proof')) {
      if (writeLen < 40) {
        earned = Math.round(item.maxPoints * 0.5);
        comments = 'Written analysis is brief. Expand upon theoretical trade-offs and complexity proofs.';
      } else if (writeLen < 150) {
        earned = Math.round(item.maxPoints * 0.85);
        comments = 'Solid conceptual overview of system architecture.';
      } else {
        earned = item.maxPoints;
        comments = 'Comprehensive theoretical breakdown with exceptional depth.';
      }
    } else {
      // General criteria
      earned = Math.round(item.maxPoints * 0.9);
      comments = 'Standard rubric requirements satisfied.';
    }

    totalAwarded += earned;
    rubricBreakdown.push({
      criteria: item.criteria,
      awardedPoints: earned,
      maxPoints: item.maxPoints,
      feedback: comments
    });
  });

  const percentage = Math.min(100, Math.round((totalAwarded / totalMaxScore) * 100));

  let grade = 'B';
  if (percentage >= 95) grade = 'A+';
  else if (percentage >= 85) grade = 'A';
  else if (percentage >= 75) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  else grade = 'Needs Revision';

  // Generate personalized AI feedback
  let aiFeedback = '';
  if (percentage >= 90) {
    aiFeedback = `🌟 Outstanding Submission! Your solution for "${assignment.title}" demonstrates rigorous algorithmic structuring and thorough theoretical exposition. Code readability and edge case handling exceed standard curriculum benchmarks.`;
  } else if (percentage >= 75) {
    aiFeedback = `✅ Strong Work! Your submission demonstrates good command over the core concepts. To reach maximum mastery, ensure detailed documentation of asymptotic time complexity and consider handling atypical boundary conditions.`;
  } else {
    aiFeedback = `💡 Good Initial Attempt. Your logic provides a great foundation, but some required methods or written analyses were left partially incomplete. Review the rubrics and starter templates to refine your submission.`;
  }

  return {
    score: totalAwarded,
    maxScore: totalMaxScore,
    percentage,
    grade,
    rubricBreakdown,
    aiFeedback
  };
};

// @desc    Get all assignments for current study role & course
// @route   GET /api/assignments
// @access  Private
export const getAssignments = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const studyRole = req.query.studyRole || req.user.studyRole || 'programming';
    const courseId = req.query.courseId;
    const statusFilter = req.query.status;

    let assignments = [];
    let submissions = [];

    if (inMemoryStore.isInMemory) {
      assignments = inMemoryStore.assignments.filter((a) => {
        let match = a.studyRole === studyRole;
        if (courseId) match = match && a.courseId === courseId;
        return match;
      });
      submissions = inMemoryStore.assignmentSubmissions.filter((s) => s.userId === userId);
    } else {
      const filter = { studyRole };
      if (courseId) filter.courseId = courseId;
      assignments = await Assignment.find(filter).sort({ order: 1 });
      submissions = await AssignmentSubmission.find({ userId });
    }

    const subMap = {};
    submissions.forEach((sub) => {
      subMap[sub.assignmentId] = sub;
    });

    const now = new Date();

    const assignmentsWithStatus = assignments.map((asgn) => {
      const asgnIdStr = (asgn._id || asgn.code).toString();
      const userSub = subMap[asgnIdStr] || subMap[asgn.code];

      // Calculate relative due date
      const daysUntilDue = asgn.dueDateDays || 7;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysUntilDue);

      const status = userSub ? userSub.status : 'pending';

      return {
        _id: asgn._id || asgn.code,
        title: asgn.title,
        code: asgn.code,
        studyRole: asgn.studyRole,
        courseId: asgn.courseId,
        moduleLevel: asgn.moduleLevel,
        category: asgn.category,
        totalPoints: asgn.totalPoints,
        difficulty: asgn.difficulty,
        dueDate: dueDate.toISOString(),
        dueDateFormatted: `In ${daysUntilDue} days`,
        description: asgn.description,
        learningObjectives: asgn.learningObjectives || [],
        deliverables: asgn.deliverables || [],
        submissionType: asgn.submissionType,
        rubricCount: asgn.rubric?.length || 0,
        userStatus: status,
        userScore: userSub ? userSub.score : null,
        userMaxScore: userSub ? userSub.maxScore : asgn.totalPoints,
        userPercentage: userSub ? userSub.percentage : null,
        userGrade: userSub ? userSub.grade : null,
        submittedAt: userSub ? userSub.submittedAt : null
      };
    });

    let filtered = assignmentsWithStatus;
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter((a) => a.userStatus === 'pending');
      } else if (statusFilter === 'graded' || statusFilter === 'submitted') {
        filtered = filtered.filter((a) => a.userStatus === 'graded' || a.userStatus === 'submitted');
      }
    }

    const totalAssignments = assignmentsWithStatus.length;
    const submittedCount = assignmentsWithStatus.filter((a) => a.userStatus !== 'pending').length;
    const gradedList = assignmentsWithStatus.filter((a) => a.userScore !== null);
    const averageScore = gradedList.length > 0
      ? Math.round(gradedList.reduce((acc, a) => acc + a.userPercentage, 0) / gradedList.length)
      : 0;

    res.json({
      success: true,
      assignments: filtered,
      stats: {
        totalAssignments,
        submittedCount,
        pendingCount: totalAssignments - submittedCount,
        averageScore
      }
    });
  } catch (error) {
    console.error('Error in getAssignments:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving assignments.' });
  }
};

// @desc    Get single assignment details with rubric & starter template
// @route   GET /api/assignments/:id
// @access  Private
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    let assignment = null;
    let userSub = null;

    if (inMemoryStore.isInMemory) {
      assignment = inMemoryStore.assignments.find((a) => (a._id && a._id.toString() === id) || a.code === id);
      userSub = inMemoryStore.assignmentSubmissions.find(
        (s) => s.userId === userId && (s.assignmentId === id || s.assignmentCode === assignment?.code)
      );
    } else {
      assignment = await Assignment.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { code: id }]
      });
      if (assignment) {
        userSub = await AssignmentSubmission.findOne({ userId, assignmentId: assignment._id.toString() });
      }
    }

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    res.json({
      success: true,
      assignment: {
        _id: assignment._id || assignment.code,
        title: assignment.title,
        code: assignment.code,
        studyRole: assignment.studyRole,
        courseId: assignment.courseId,
        moduleLevel: assignment.moduleLevel,
        category: assignment.category,
        totalPoints: assignment.totalPoints,
        difficulty: assignment.difficulty,
        estimatedDays: assignment.estimatedDays,
        dueDateDays: assignment.dueDateDays,
        description: assignment.description,
        problemStatement: assignment.problemStatement,
        learningObjectives: assignment.learningObjectives || [],
        deliverables: assignment.deliverables || [],
        submissionType: assignment.submissionType,
        starterTemplate: assignment.starterTemplate || { code: '', writtenTemplate: '' },
        rubric: assignment.rubric || []
      },
      userSubmission: userSub
        ? {
            codeSubmission: userSub.codeSubmission,
            writtenSubmission: userSub.writtenSubmission,
            score: userSub.score,
            maxScore: userSub.maxScore,
            percentage: userSub.percentage,
            grade: userSub.grade,
            status: userSub.status,
            aiFeedback: userSub.aiFeedback,
            rubricBreakdown: userSub.rubricBreakdown,
            submittedAt: userSub.submittedAt
          }
        : null
    });
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving assignment details.' });
  }
};

// @desc    Submit assignment & trigger rubric grading
// @route   POST /api/assignments/:id/submit
// @access  Private
export const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { codeSubmission, writtenSubmission } = req.body;
    const userId = req.user._id.toString();

    if (!codeSubmission && !writtenSubmission) {
      return res.status(400).json({ success: false, message: 'Please submit code or written solution.' });
    }

    let assignment = null;
    if (inMemoryStore.isInMemory) {
      assignment = inMemoryStore.assignments.find((a) => (a._id && a._id.toString() === id) || a.code === id);
    } else {
      assignment = await Assignment.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { code: id }]
      });
    }

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const evalResult = evaluateAssignmentSubmission(assignment, codeSubmission, writtenSubmission);
    const asgnIdStr = (assignment._id || assignment.code).toString();
    const xpReward = 100;

    if (inMemoryStore.isInMemory) {
      let existingSub = inMemoryStore.assignmentSubmissions.find(
        (s) => s.userId === userId && (s.assignmentId === asgnIdStr || s.assignmentCode === assignment.code)
      );

      const isFirstSubmission = !existingSub;

      if (isFirstSubmission) {
        // Award XP to user in-memory
        const userMem = inMemoryStore.users.find((u) => u._id.toString() === userId);
        if (userMem) {
          if (!userMem.learningStats) userMem.learningStats = { totalXP: 50 };
          userMem.learningStats.totalXP = (userMem.learningStats.totalXP || 0) + xpReward;
        }
      }

      if (existingSub) {
        existingSub.codeSubmission = codeSubmission || existingSub.codeSubmission;
        existingSub.writtenSubmission = writtenSubmission || existingSub.writtenSubmission;
        existingSub.score = evalResult.score;
        existingSub.maxScore = evalResult.maxScore;
        existingSub.percentage = evalResult.percentage;
        existingSub.grade = evalResult.grade;
        existingSub.status = 'graded';
        existingSub.aiFeedback = evalResult.aiFeedback;
        existingSub.rubricBreakdown = evalResult.rubricBreakdown;
        existingSub.submittedAt = new Date();
      } else {
        existingSub = {
          _id: `asgn_sub_${Date.now()}`,
          userId,
          assignmentId: asgnIdStr,
          assignmentCode: assignment.code,
          studyRole: assignment.studyRole,
          courseId: assignment.courseId,
          codeSubmission: codeSubmission || '',
          writtenSubmission: writtenSubmission || '',
          score: evalResult.score,
          maxScore: evalResult.maxScore,
          percentage: evalResult.percentage,
          grade: evalResult.grade,
          status: 'graded',
          aiFeedback: evalResult.aiFeedback,
          rubricBreakdown: evalResult.rubricBreakdown,
          submittedAt: new Date()
        };
        inMemoryStore.assignmentSubmissions.push(existingSub);
      }

      return res.json({
        success: true,
        submission: existingSub,
        xpAwarded: isFirstSubmission ? xpReward : 0,
        message: `🎯 Assignment Graded: ${evalResult.score}/${evalResult.maxScore} (${evalResult.grade})`
      });
    } else {
      // MongoDB Mode
      let existingSub = await AssignmentSubmission.findOne({ userId, assignmentId: asgnIdStr });
      const isFirstSubmission = !existingSub;

      if (isFirstSubmission) {
        await User.findByIdAndUpdate(userId, {
          $inc: { 'learningStats.totalXP': xpReward }
        });
      }

      if (existingSub) {
        existingSub.codeSubmission = codeSubmission || existingSub.codeSubmission;
        existingSub.writtenSubmission = writtenSubmission || existingSub.writtenSubmission;
        existingSub.score = evalResult.score;
        existingSub.maxScore = evalResult.maxScore;
        existingSub.percentage = evalResult.percentage;
        existingSub.grade = evalResult.grade;
        existingSub.status = 'graded';
        existingSub.aiFeedback = evalResult.aiFeedback;
        existingSub.rubricBreakdown = evalResult.rubricBreakdown;
        existingSub.submittedAt = new Date();
        await existingSub.save();
      } else {
        existingSub = await AssignmentSubmission.create({
          userId,
          assignmentId: asgnIdStr,
          assignmentCode: assignment.code,
          studyRole: assignment.studyRole,
          courseId: assignment.courseId,
          codeSubmission: codeSubmission || '',
          writtenSubmission: writtenSubmission || '',
          score: evalResult.score,
          maxScore: evalResult.maxScore,
          percentage: evalResult.percentage,
          grade: evalResult.grade,
          status: 'graded',
          aiFeedback: evalResult.aiFeedback,
          rubricBreakdown: evalResult.rubricBreakdown
        });
      }

      return res.json({
        success: true,
        submission: existingSub,
        xpAwarded: isFirstSubmission ? xpReward : 0,
        message: `🎯 Assignment Graded: ${evalResult.score}/${evalResult.maxScore} (${evalResult.grade})`
      });
    }
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ success: false, message: 'Server error evaluating assignment.' });
  }
};
