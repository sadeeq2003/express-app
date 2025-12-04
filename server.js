const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

const { MongoClient, ObjectId } = require('mongodb');
const mongoUri = 'mongodb+srv://abusadeeq365_db_user:JOd7fok2wdItnIcs@cluster0.of6vrhu.mongodb.net/';
const dbName = 'marketplace';
const collectionName = 'lessons';

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

app.use(express.json());

app.post('/orders', async (req, res) => {
  let client;
  try {
    client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    const order = req.body;
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ message: 'Order saved', orderId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order' });
  } finally {
    if (client) await client.close();
  }
});

app.put('/lessons/:id', async (req, res) => {
  let client;
  try {
    client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    const lessonId = req.params.id;
    const { spaces } = req.body;
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: { spaces } }
    );
    if (result.modifiedCount === 1) {
      res.json({ message: 'Lesson spaces updated' });
    } else {
      res.status(404).json({ error: 'Lesson not found or not updated' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lesson spaces' });
  } finally {
    if (client) await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
