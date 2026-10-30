import mongoose from './node_modules/mongoose/index.js';
import bcrypt from './node_modules/bcryptjs/index.js';

const NEW_PASSWORD = 'Edura@2026';

await mongoose.connect('mongodb://127.0.0.1:27017/edura_ai');
const db = mongoose.connection.db;

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

const result = await db.collection('users').updateOne(
  { email: 'manojkumartn208899@gmail.com' },
  { $set: { password: hashedPassword } }
);

console.log('Update result:', result.modifiedCount === 1 ? 'SUCCESS - Password reset!' : 'FAILED');
console.log('New password is:', NEW_PASSWORD);
console.log('Email:', 'manojkumartn208899@gmail.com');

await mongoose.disconnect();
process.exit(0);
