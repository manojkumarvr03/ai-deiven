import connectDB, { inMemoryStore } from './config/db.js';
import { INITIAL_TASKS, INITIAL_ASSIGNMENTS } from './config/seedTasksAndAssignments.js';

async function testSeeding() {
  console.log('Testing Task & Assignment data structure...');
  console.log(`Tasks Count: ${INITIAL_TASKS.length}`);
  console.log(`Assignments Count: ${INITIAL_ASSIGNMENTS.length}`);
  
  if (INITIAL_TASKS.length > 0 && INITIAL_ASSIGNMENTS.length > 0) {
    console.log('SUCCESS: Seed data structured properly.');
  } else {
    console.error('FAILED: Seed data empty.');
  }
}

testSeeding();
