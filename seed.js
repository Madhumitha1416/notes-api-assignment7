require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/Note');

const sampleNotes = [
  { title: 'Welcome note', content: 'First note stored in MongoDB.', category: 'General' },
  { title: 'Team meeting', content: 'Sprint planning on Monday at 10 AM.', category: 'Work' },
  { title: 'Submit report', content: 'Finish and send the weekly status report.', category: 'Work' },
  { title: 'Grocery list', content: 'Milk, eggs, rice, vegetables, fruits.', category: 'Personal' },
  { title: 'Doctor appointment', content: 'Dental check-up on Friday evening.', category: 'Personal' },
  { title: 'App idea', content: 'Build a habit tracker with the MERN stack.', category: 'Ideas' },
  { title: 'Blog idea', content: 'Write about Mongoose schemas and validation.', category: 'Ideas' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await Note.deleteMany({});
    const inserted = await Note.insertMany(sampleNotes);
    console.log(`🌱 Seeded ${inserted.length} notes`);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
})();
