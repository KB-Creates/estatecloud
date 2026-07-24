import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';
import propertyRoutes from './routes/property.routes.js';
import unitRoutes from './routes/unit.routes.js';
import contractRoutes from './routes/contract.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import authRoutes from './routes/auth.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import reportRoutes from './routes/report.routes.js';
import agentRoutes from './routes/agent.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import staffRoutes from './routes/staff.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import payrollRoutes from './routes/payroll.routes.js';
import settingRoutes from './routes/setting.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import trashRoutes from './routes/trash.js';
import superadminRoutes from './routes/superadmin.routes.js';
import companyRoutes from './routes/company.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ override: true });
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Adjust this for production
  },
});
global.io = io;

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.10.5:5173',  // Local network access
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    var msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
    return callback(new Error(msg), false);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Attach socket.io instance to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/super-admin', superadminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/trash', trashRoutes);

import { seedRoles } from './utils/seedRoles.js';

// Database Connection (Prisma auto-connects via DATABASE_URL)
import prisma from './lib/prisma.js';
prisma.$connect()
  .then(async () => {
    console.log('Connected to PostgreSQL via Prisma');
    await seedRoles();
  })
  .catch((err) => console.error('Database connection error:', err));

// WebSocket Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data); // Broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Static Files (Frontend)
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// Handle React Routing (Fallthrough) - This MUST be the last route
app.use((req, res) => {
  // Only handle non-API routes that weren't handled by static middleware
  if (!req.url.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send("Frontend build not found. Please run 'npm run build' first.");
      }
    });
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Server restart triggered - reload schema v2