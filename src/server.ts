// src/server.ts

import app from './app';
import serverless from 'serverless-http';
import { logInfo, logError } from './utils/logger';

// Wrap the Express app with serverless-http to create a handler
const handler = serverless(app);

// Optional: Add logging for each invocation
const wrappedHandler = async (event: any, context: any) => {
  logInfo('Function invoked', {
    path: event.path,
    httpMethod: event.httpMethod,
  });
  try {
    const response = await handler(event, context);
    return response;
  } catch (error: any) {
    logError('Function error', { error: error.message, stack: error.stack });
    throw error;
  }
};

export default wrappedHandler;
