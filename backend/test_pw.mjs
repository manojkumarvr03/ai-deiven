import mongoose from './node_modules/mongoose/index.js';
import bcrypt from './node_modules/bcryptjs/index.js';

await mongoose.connect('mongodb://127.0.0.1:27017/edura_ai');
const db = mongoose.connection.db;
const user = await db.collection('users').findOne({email: 'manojkumartn208899@gmail.com'});
console.log('User found:', user ? 'YES' : 'NO');
if (user && user.password) {
  console.log('Hash prefix:', user.password.substring(0, 7));
  const passwords = ['123456', '12345678', 'Manoj@123', 'manoj123', 'password', 'Manoj123', 'manoj@123'];
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, user.password);
    if (match) console.log('MATCH FOUND:', pwd);
    else console.log('No match:', pwd);
  }
} else {
  console.log('No password field found in DB!');
}
await mongoose.disconnect();
process.exit(0);
