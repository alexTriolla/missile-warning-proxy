// src/server.ts

import app from './app';
import { logInfo, logError } from './utils/logger';

const PORT = process.env.PORT || 3010;

app
  .listen(PORT, () => {
    logInfo(`Proxy server running on port ${PORT}`);
  })
  .on('error', (err) => {
    logError('Server failed to start', { error: err.message });
  });
