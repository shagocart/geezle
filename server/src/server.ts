
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import cmsRoutes from './routes/cms';
import financeRoutes from './routes/finance';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

// Real-Time Socket Layer
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Lock this down in production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Attach IO to request for controllers
app.use((req, res, next) => {
  (req as any).io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/finance', financeRoutes);

// Socket Logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room); // e.g., 'admin_updates', 'user_123'
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 WebSockets active`);
});
