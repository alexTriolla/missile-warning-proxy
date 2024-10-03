// src/server.ts

import app from './app';
import serverless from 'serverless-http';

// Wrap the Express app with serverless-http
const handler = serverless(app);

// Export the handler for Vercel to use
export default handler;
