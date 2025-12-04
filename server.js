// Import the Express module
const express = require('express');
// Import the CORS middleware to enable Cross-Origin Resource Sharing
const cors = require('cors');
// Create an Express application instance
const app = express();

// Use CORS middleware for all incoming requests
app.use(cors());

// Logger middleware
// Log each incoming request with timestamp, HTTP method, and URL
app.use((req, res, next) => {
  // Print the request details to the console
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Call the next middleware in the stack
  next();
});

// Static file middleware for lesson images
// Import the path module for working with file and directory paths
const path = require('path');
// Import the fs (filesystem) module for file operations
const fs = require('fs');

// Serve image files from the /images route
app.use('/images', (req, res, next) => {
  // Build the absolute path to the requested image
  const imgPath = path.join(__dirname, 'images', req.path);
  // Check if the image file exists
  fs.access(imgPath, fs.constants.F_OK, (err) => {
    // If the image does not exist, return a 404 error
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    } else {
      // If the image exists, send the file as a response
      res.sendFile(imgPath);
    }
  });
});

// MongoDB setup
// Import the MongoClient class and ObjectId from the mongodb package
const { MongoClient, ObjectId } = require('mongodb');
// MongoDB connection string (replace with your actual credentials)
const mongoUri = 'mongodb+srv://abusadeeq365_db_user:JOd7fok2wdItnIcs@cluster0.of6vrhu.mongodb.net/'; // Use your actual connection string
// Name of the database to use
const dbName = 'marketplace';
// Name of the lessons collection
const collectionName = 'lessons';

// GET /lessons endpoint
// Define a route to fetch all lessons from the database
app.get('/lessons', async (req, res) => {
  // Declare a variable for the MongoDB client
  let client;
  try {
    // Create a new MongoDB client instance
    client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    // Connect to the MongoDB server
    await client.connect();
    // Get the database instance
    const db = client.db(dbName);
    // Fetch all lessons from the lessons collection
    const lessons = await db.collection(collectionName).find({}).toArray();
    // Send the lessons as a JSON response
    res.json(lessons);
  } catch (err) {
    // Handle errors and send a 500 response
    res.status(500).json({ error: 'Failed to fetch lessons' });
  } finally {
    // Close the MongoDB client connection if it was opened
    if (client) await client.close();
  }
});

// Parse incoming JSON requests
app.use(express.json());

// POST /orders endpoint
// Define a route to save a new order to the database
app.post('/orders', async (req, res) => {
  // Declare a variable for the MongoDB client
  let client;
  try {
    // Create a new MongoDB client instance
    client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    // Connect to the MongoDB server
    await client.connect();
    // Get the database instance
    const db = client.db(dbName);
    // Retrieve the order data from the request body
    const order = req.body;
    // Optionally add validation here
    // Insert the order into the 'orders' collection
    const result = await db.collection('orders').insertOne(order);
    // Send a success response with the new order ID
    res.status(201).json({ message: 'Order saved', orderId: result.insertedId });
  } catch (err) {
    // Handle errors and send a 500 response
    res.status(500).json({ error: 'Failed to save order' });
  } finally {
    // Close the MongoDB client connection if it was opened
    if (client) await client.close();
  }
});

// PUT /lessons/:id endpoint to update lesson spaces
// Define a route to update the number of spaces for a lesson
app.put('/lessons/:id', async (req, res) => {
  // Declare a variable for the MongoDB client
  let client;
  try {
    // Create a new MongoDB client instance
    client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    // Connect to the MongoDB server
    await client.connect();
    // Get the database instance
    const db = client.db(dbName);
    // Get the lesson _id from the URL parameter
    const lessonId = req.params.id;
    // Extract the new number of spaces from the request body
    const { spaces } = req.body;
    // Update the lesson's spaces in the database using _id
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: { spaces } }
    );
    // If a lesson was updated, send a success response
    if (result.modifiedCount === 1) {
      res.json({ message: 'Lesson spaces updated' });
    } else {
      // If no lesson was updated, send a 404 error
      res.status(404).json({ error: 'Lesson not found or not updated' });
    }
  } catch (err) {
    // Handle errors and send a 500 response
    res.status(500).json({ error: 'Failed to update lesson spaces' });
  } finally {
    // Close the MongoDB client connection if it was opened
    if (client) await client.close();
  }
});

// Placeholder for other routes and middleware

// Get the port number from the environment or default to 3000
const PORT = process.env.PORT || 3000;
// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  // Log a message indicating the server is running
  console.log(`Server running on port ${PORT}`);
});
