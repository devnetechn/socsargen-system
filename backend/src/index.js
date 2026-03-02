require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const doctorsRoutes = require('./routes/doctors.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const newsRoutes = require('./routes/news.routes');
const servicesRoutes = require('./routes/services.routes');
const uploadRoutes = require('./routes/upload.routes');
const jobsRoutes = require('./routes/jobs.routes');
const applicationsRoutes = require('./routes/applications.routes');
const usersRoutes = require('./routes/users.routes');

const awardsRoutes = require('./routes/awards.routes');

// Import services
const { handleChatMessage, saveMessage } = require('./services/chat.service');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// CORS - Whitelist allowed origins
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(s => s.trim());

const corsOriginCheck = (origin, callback) => {
  if (!origin) return callback(null, true); // Allow no-origin (mobile, curl, Postman)
  if (allowedOrigins.includes(origin)) return callback(null, true);
  // Allow LAN IPs in development
  if (process.env.NODE_ENV !== 'production' && origin.match(/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/)) {
    return callback(null, true);
  }
  return callback(new Error('Not allowed by CORS'));
};

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ===========================================
// MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://connect.facebook.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      frameSrc: ["'self'", "https://www.facebook.com", "https://web.facebook.com", "https://www.google.com"],
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:"],
    }
  }
}));

// CORS - Whitelist allowed origins
app.use(cors({
  origin: corsOriginCheck,
  credentials: true
}));

// Cookie parser (for refresh token HttpOnly cookies)
app.use(cookieParser());

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API rate limiting
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
app.use('/api/', apiLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===========================================
// API ROUTES
// ===========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Socsargen Hospital API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    dbConfigured: !!process.env.DATABASE_URL,
    jwtConfigured: !!process.env.JWT_SECRET
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/users', usersRoutes);

app.use('/api/awards', awardsRoutes);

// ===========================================
// SOCKET.IO CHAT HANDLERS
// ===========================================

// Track connected users and escalated sessions
const connectedUsers = new Map();
const escalatedSessions = new Map(); // Changed to Map to store more info: sessionId -> { sessionId, userId, socketId, timestamp }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let sessionId = socket.id;
  let userId = null;
  let isEscalated = false;

  // Restore session - load chat history and escalation status
  socket.on('restore_session', async (data) => {
    sessionId = data.sessionId || socket.id;
    userId = data.userId || null;
    connectedUsers.set(socket.id, { sessionId, userId });

    console.log('=== SESSION RESTORE ===');
    console.log('Session ID:', sessionId);
    console.log('User ID:', userId);

    try {
      // Check if session is escalated
      isEscalated = escalatedSessions.has(sessionId);

      if (isEscalated) {
        // Rejoin the escalated room
        socket.join('escalated_' + sessionId);
        console.log('Rejoined escalated room:', 'escalated_' + sessionId);

        // Update the socketId in escalatedSessions (user reconnected)
        const existingData = escalatedSessions.get(sessionId);
        escalatedSessions.set(sessionId, {
          ...existingData,
          socketId: socket.id
        });
      }

      // Load chat history from database
      const { getChatHistory } = require('./services/chat.service');
      const messages = await getChatHistory(sessionId);

      console.log('Loaded messages:', messages.length);

      // Send session data back to user
      socket.emit('session_restored', {
        sessionId,
        isEscalated,
        messages
      });

    } catch (error) {
      console.error('Session restore error:', error);
      socket.emit('session_restored', {
        sessionId,
        isEscalated: false,
        messages: []
      });
    }
  });

  // Legacy authenticate handler (for backward compatibility)
  socket.on('authenticate', (data) => {
    userId = data.userId;
    sessionId = data.sessionId || socket.id;
    connectedUsers.set(socket.id, { sessionId, userId });
    console.log('User authenticated:', userId);
  });

  // Handle chat messages
  socket.on('chat_message', async (data) => {
    try {
      const { message } = data;

      if (!message || message.trim() === '') {
        return;
      }

      if (isEscalated || escalatedSessions.has(sessionId)) {
        // Message goes to staff queue
        console.log('=== ESCALATED MESSAGE FROM USER ===');
        console.log('Session:', sessionId);
        console.log('Message:', message);

        await saveMessage(sessionId, userId, message, 'user');
        io.to('staff_room').emit('escalated_message', {
          sessionId,
          userId,
          message,
          socketId: socket.id,
          timestamp: new Date()
        });

        console.log('Sent to staff_room');
      } else {
        // AI handles it
        const result = await handleChatMessage(sessionId, userId, message);

        socket.emit('chat_response', {
          message: result.message,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: result.suggestions || []
        });

        // Check if should escalate
        if (result.escalate) {
          isEscalated = true;
          const escalationData = {
            sessionId,
            userId,
            socketId: socket.id,
            timestamp: new Date()
          };
          escalatedSessions.set(sessionId, escalationData);
          socket.join('escalated_' + sessionId);

          // Notify staff
          io.to('staff_room').emit('new_escalation', escalationData);

          // Notify user
          socket.emit('chat_escalated', {
            message: 'You are now connected to our staff. Please wait for a response.'
          });
        }
      }
    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('chat_response', {
        message: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      });
    }
  });

  // User manually requests human assistance
  socket.on('request_human_assistance', () => {
    console.log('=== HUMAN ASSISTANCE REQUESTED ===');
    console.log('Session ID:', sessionId);
    console.log('Socket ID:', socket.id);
    console.log('Already escalated?', isEscalated);
    console.log('In escalatedSessions?', escalatedSessions.has(sessionId));

    if (!isEscalated && !escalatedSessions.has(sessionId)) {
      isEscalated = true;
      const escalationData = {
        sessionId,
        userId,
        socketId: socket.id,
        timestamp: new Date(),
        reason: 'User requested human assistance'
      };
      escalatedSessions.set(sessionId, escalationData);
      socket.join('escalated_' + sessionId);

      console.log('User joined room:', 'escalated_' + sessionId);
      console.log('Sending to staff_room...');

      // Notify staff
      io.to('staff_room').emit('new_escalation', escalationData);

      // Notify user
      socket.emit('chat_escalated', {
        message: 'You are now connected to our staff. A team member will assist you shortly. Please wait for a response.'
      });

      console.log('Escalation complete. Total escalated sessions:', escalatedSessions.size);
    }
  });

  // Staff joins staff room
  socket.on('join_staff', async (data = {}) => {
    socket.join('staff_room');
    const staffName = data?.staffName || 'Staff';
    const staffId = data?.staffId || null;

    // Store staff info for this socket
    socket.staffName = staffName;
    socket.staffId = staffId;

    console.log('=== STAFF JOINED ===');
    console.log('Staff socket ID:', socket.id);
    console.log('Staff name:', staffName);
    console.log('Current escalated sessions:', escalatedSessions.size);

    // Send existing escalated sessions to the newly joined staff
    if (escalatedSessions.size > 0) {
      const existingEscalations = Array.from(escalatedSessions.values());

      // Get chat history for each escalated session
      for (const escalation of existingEscalations) {
        try {
          const { getChatHistory } = require('./services/chat.service');
          const history = await getChatHistory(escalation.sessionId);

          // Format messages for the admin
          const messages = history.map(msg => ({
            text: msg.message,
            sender: msg.sender,
            timestamp: msg.created_at
          }));

          socket.emit('new_escalation', {
            ...escalation,
            messages,
            lastMessage: messages.length > 0 ? messages[messages.length - 1]?.text : 'Waiting for response...'
          });
        } catch (err) {
          // Send without history if error
          socket.emit('new_escalation', escalation);
        }
      }

      console.log(`Sent ${existingEscalations.length} existing escalations to staff`);
    }
  });

  // Staff responds to escalated chat
  socket.on('staff_response', async (data) => {
    try {
      const { targetSessionId, message, staffName } = data;
      const senderName = staffName || socket.staffName || 'Staff';

      console.log('=== STAFF RESPONSE ===');
      console.log('Target session:', targetSessionId);
      console.log('Staff name:', senderName);
      console.log('Message:', message);
      console.log('Sending to room:', 'escalated_' + targetSessionId);

      // Save message with staff name
      await saveMessage(targetSessionId, null, message, 'staff', senderName);

      // Send to user in escalated session with staff name
      io.to('escalated_' + targetSessionId).emit('chat_response', {
        message,
        sender: 'staff',
        staffName: senderName,
        timestamp: new Date()
      });

      console.log('Staff response sent!');
    } catch (error) {
      console.error('Staff response error:', error);
    }
  });

  // Staff resolves escalation
  socket.on('resolve_escalation', (data) => {
    const { targetSessionId } = data;
    escalatedSessions.delete(targetSessionId);

    io.to('escalated_' + targetSessionId).emit('escalation_resolved', {
      message: 'Your inquiry has been resolved. Thank you for contacting Socsargen Hospital!'
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// Serve frontend build files (for production/ngrok)
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendBuildPath));

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return next();
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces for LAN access

server.listen(PORT, HOST, () => {
  console.log('===========================================');
  console.log('  SOCSARGEN HOSPITAL SYSTEM API');
  console.log('===========================================');
  console.log(`  Server running on http://${HOST}:${PORT}`);
  console.log(`  LAN Access: http://<your-ip>:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('===========================================');
});

module.exports = { app, io, server };
