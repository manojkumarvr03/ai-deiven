import mongoose from 'mongoose';
import EducationCourse from './models/EducationCourse.js';
import Task from './models/Task.js';
import Assignment from './models/Assignment.js';
import dotenv from 'dotenv';
dotenv.config();

const verifySchool = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edura_ai');
  
  const schoolCourses = await EducationCourse.find({ studyRole: 'school' });
  console.log(`\nFound ${schoolCourses.length} School Courses:`);
  for (const c of schoolCourses) {
    console.log(`- ${c.title} (${c.code}): ${c.modules.length} Levels`);
    if (c.code === 'school_class_1') {
      console.log('  Class 1 Levels & Diagnostic Quizzes:');
      for (const m of c.modules) {
        console.log(`   * ${m.title}`);
        console.log(`     Quiz: "${m.assessment?.title}" (${m.assessment?.questions?.length} questions)`);
        for (const q of (m.assessment?.questions || [])) {
          console.log(`       - Q: ${q.question} -> Ans: ${q.options[q.correctIndex]}`);
        }
      }
    }
  }

  const schoolTasks = await Task.find({ studyRole: 'school' });
  console.log(`\nFound ${schoolTasks.length} School Tasks:`);
  for (const t of schoolTasks) {
    console.log(`- [${t.difficulty}] ${t.title} (${t.category})`);
  }

  const schoolAssignments = await Assignment.find({ studyRole: 'school' });
  console.log(`\nFound ${schoolAssignments.length} School Assignments:`);
  for (const a of schoolAssignments) {
    console.log(`- [${a.difficulty}] ${a.title} (${a.category})`);
  }

  await mongoose.disconnect();
};

verifySchool().catch(console.error);
