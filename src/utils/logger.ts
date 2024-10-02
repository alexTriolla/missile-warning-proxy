import fs from 'fs';
import path from 'path';

// Define log file paths
const infoLogPath = path.join(__dirname, '../../logs/info.log');
const errorLogPath = path.join(__dirname, '../../logs/error.log');

export function logInfo(infoData: object) {
  const logEntry = `${JSON.stringify(infoData, null, 2)},\n`;

  // Write info logs to info.log
  fs.appendFileSync(infoLogPath, logEntry, 'utf8');
}

export function logError(errorData: object) {
  const logEntry = `${JSON.stringify(errorData, null, 2)},\n`;

  // Write error logs to error.log
  fs.appendFileSync(errorLogPath, logEntry, 'utf8');
}
