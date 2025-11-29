const express = require('express');
const app = express();

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static file middleware for lesson images
const path = require('path');
const fs = require('fs');

app.use('/images', (req, res, next) => {
  const imgPath = path.join(__dirname, 'images', req.path);
  fs.access(imgPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    } else {
      res.sendFile(imgPath);
    }
  });
});

// MongoDB setup
const { MongoClient } = require('mongodb');
const mongoUri = 'mongodb+srv://abusadeeq365_db_user:JOd7fok2wdItnIcs@cluster0.of6vrhu.mongodb.net/'; // Use your actual connection string
const dbName = 'marketplace';
const collectionName = 'lessons';

// GET /lessons endpoint
app.get('/lessons', async (req, res) => {
  let client;
  try {
    client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    const lessons = await db.collection(collectionName).find({}).toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  } finally {
    if (client) await client.close();
  }
});

// Placeholder for other routes and middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
