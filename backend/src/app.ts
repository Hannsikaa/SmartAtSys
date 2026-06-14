import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { globalRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import attendanceRoutes from './routes/attendance.routes';
import studentRoutes from './routes/student.routes';
import facultyRoutes from './routes/faculty.routes';
import analyticsRoutes from './routes/analytics.routes';
import predictionRoutes from './routes/prediction.routes';
import notificationRoutes from './routes/notification.routes';
import powerbiRoutes from './routes/powerbi.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(globalRateLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'SmartAtSys backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/powerbi', powerbiRoutes);

app.use(errorHandler);

export default app;
