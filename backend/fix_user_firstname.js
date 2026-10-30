import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edura_ai', {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[MongoDB Connected]');

    // Patch admin user to add firstName (required by main User model)
    const result = await mongoose.connection.collection('users').updateMany(
      { firstName: { $exists: false } },
      [{
        $set: {
          firstName: {
            $cond: {
              if: { $and: [{ $ne: ['$name', null] }, { $ne: ['$name', ''] }] },
              then: { $arrayElemAt: [{ $split: ['$name', ' '] }, 0] },
              else: 'Admin'
            }
          }
        }
      }]
    );

    console.log(`[Patched]: Updated ${result.modifiedCount} user(s) with missing firstName field.`);
    await mongoose.disconnect();
    console.log('[Done] Login should work now!');
  } catch (err) {
    console.error('[Patch Error]:', err.message);
    console.log('[Note]: If MongoDB is not running, in-memory mode is used automatically — no fix needed.');
    process.exit(0);
  }
};

run();
