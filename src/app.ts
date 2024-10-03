// src/app.ts

import express from 'express';
import cors from 'cors';
import alertsRoute from './routes/alerts';
import mockAlertsRoute from './routes/mock-alerts';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet'; // For additional security

const app = express();

// Enable Helmet for security headers
app.use(helmet());

// Enable CORS for all routes (allowing browser requests)
app.use(cors());

// Use JSON parser
app.use(express.json());

// Define rate limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Set up routes
app.use('/alerts', alertsRoute); // Real alerts route
app.use('/mock-alerts', mockAlertsRoute); // New mock alerts route

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found.' });
  // Optionally, log this event
});

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Global Error Handler:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
);

export default app;
