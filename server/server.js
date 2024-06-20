const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const chatRoutes = require('./routes/chatRoutes')
const Notes = require('./models/notesModel');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const messages = {
  'courseID_1': []
};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinCourse', (courseID) => {
    socket.join(courseID);
    console.log(`User joined course: ${courseID}`);

    // Send existing messages to the newly joined user
    socket.emit('receiveMessage', messages[courseID]);
  });

  socket.on('sendMessage', (data) => {
    const { courseId, message } = data;
    if (!messages[courseId]) {
      messages[courseId] = []
    }
    messages[courseId].push(message);

    io.to(courseId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let count = {} ;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//socket.io setup
// io.on('connection', (socket) => {
//   console.log('New client connected');
//
//   socket.on('joinCourse', (courseId) => {
//     count[courseId] = count[courseId] ? count[courseId] + 1 : 1
//     console.log("user jonied course", courseId)
//     socket.join(courseId);
//   });
//
//   socket.on('sendMessage', (data) => {
//     io.to(data.courseId).emit('receiveMessage', data.message);
//     io.to(data.courseId).emit('notification', {
//       message: 'New message in your course!',
//       courseId: data.courseId,
//     });
//   });
//
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// Route setup
app.use('/ping', (req, res) => {
  res.send("pong kaboom")
});
app.use('/api/users', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chat', chatRoutes)

app.post('/courses/upload', async (req, res) => {
  console.log('Upload endpoint hit');
  const { courseId, week, fileLink } = req.body;

  console.log('Received data:', { courseId, week, fileLink });

  if (!courseId || !week || !fileLink) {
    console.error('Missing required fields');
    return res.status(400).json({ message: 'Course ID, week, and file link are required' });
  }

  try {
    const assignment = new Notes({ courseId, week, fileLink });
    await assignment.save();

    console.log('File uploaded and assignment saved');
    res.status(201).json({ message: 'File uploaded successfully', assignment });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
