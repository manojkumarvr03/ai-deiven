import connectDB from './config/db.js';
import { seedEducationDatabase } from './config/seedEducation.js';
import { seedTasksAndAssignmentsDatabase } from './config/seedTasksAndAssignments.js';
import EducationCourse from './models/EducationCourse.js';
import Task from './models/Task.js';
import Assignment from './models/Assignment.js';

async function updateSeed() {
  console.log('Seeding MongoDB with all courses, school classes (First Standard to Class 12), tasks and assignments...');
  await connectDB();
  await seedEducationDatabase();
  await seedTasksAndAssignmentsDatabase();

  const courses = await EducationCourse.find({});
  console.log(`\nUpdated ${courses.length} courses in database:`);
  for (const c of courses) {
    console.log(`- [${c.studyRole}] ${c.title} (${c.code}): ${c.modules?.length} Levels`);
  }

  const tasks = await Task.find({});
  const assignments = await Assignment.find({});
  console.log(`\nTotal Tasks in DB: ${tasks.length}`);
  console.log(`Total Assignments in DB: ${assignments.length}`);

  console.log('\nSeeding complete!');
  process.exit(0);
}

updateSeed().catch(err => {
  console.error('Seed update error:', err);
  process.exit(1);
});
