import mongoose from 'mongoose';
import fs from 'fs';

(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/skillbridge');
  const text = fs.readFileSync('..\\ml-service\\resume_text.txt', 'utf-8');
  console.log('Read text length:', text.length);
  await mongoose.connection.db.collection('users').updateMany({}, { $set: { resumeText: text } });
  await mongoose.connection.db.collection('analysissnapshots').deleteMany({});
  console.log('Updated users and cleared snapshots!');
  process.exit(0);
})();
