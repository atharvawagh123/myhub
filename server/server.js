const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/post',postRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
  });
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  
  io.on('connection', (socket) => {
    console.log('⚡ New client connected');
  
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`📥 User joined room: ${roomId}`);
    });
  
    socket.on('sendMessage', ({ roomId, senderId, message }) => {
      io.to(roomId).emit('receiveMessage', { roomId, senderId, message }); // 👈 Fix here
      console.log(`📨 Message sent to room ${roomId}: ${message}`);
    });
  
    socket.on('disconnect', () => {
      console.log('🔥 Client disconnected');
    });
  });
  
