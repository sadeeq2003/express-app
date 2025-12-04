const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://abusadeeq365_db_user:JOd7fok2wdItnIcs@cluster0.of6vrhu.mongodb.net/';
const dbName = 'marketplace';
const collectionName = 'lessons';

const lessons = [
  { id: 1, subject: 'Math', location: 'Room 101', price: 20, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/calculator.svg' },
  { id: 2, subject: 'English', location: 'Room 102', price: 18, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/book.svg' },
  { id: 3, subject: 'Physics', location: 'Lab 1', price: 25, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/atom.svg' },
  { id: 4, subject: 'Chemistry', location: 'Lab 2', price: 22, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/flask.svg' },
  { id: 5, subject: 'Biology', location: 'Room 103', price: 21, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/leaf.svg' },
  { id: 6, subject: 'History', location: 'Room 104', price: 19, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/landmark.svg' },
  { id: 7, subject: 'Geography', location: 'Room 105', price: 20, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/globe.svg' },
  { id: 8, subject: 'Music', location: 'Music Room', price: 23, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/music.svg' },
  { id: 9, subject: 'Art', location: 'Art Studio', price: 24, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/palette.svg' },
  { id: 10, subject: 'Computer Science', location: 'Lab 3', price: 26, spaces: 5, icon: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/laptop-code.svg' }
];

async function injectLessons() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    const result = await collection.insertMany(lessons);
    console.log(`Inserted ${result.insertedCount} lessons.`);
  } catch (err) {
    console.error('Error inserting lessons:', err);
  } finally {
    await client.close();
  }
}

injectLessons();
