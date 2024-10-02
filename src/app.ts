import express from 'express';
import cors from 'cors';
import alertsRoute from './routes/alerts';
// import notificationsRoute from './routes/notifications';
// import mockNotificationsRoute from './routes/mock-notifications';
import mockAlertsRoute from './routes/mock-alerts'; 

const app = express();

// Enable CORS for all routes (allowing browser requests)
app.use(cors());

// Use JSON parser
app.use(express.json());

// Set up routes
app.use('/alerts', alertsRoute); // Real alerts route
// app.use('/notifications', notificationsRoute); // Notifications route
// app.use('/mock-notifications', mockNotificationsRoute); // Mock notifications route
app.use('/mock-alerts', mockAlertsRoute); // New mock alerts route

export default app;
