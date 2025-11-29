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

// Placeholder for other routes and middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
