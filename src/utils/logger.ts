// src/utils/logger.ts

import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define custom colors for log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red bold',
    warn: 'yellow bold',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'gray',
  },
};

// Apply the custom colors
import winston from 'winston';
winston.addColors(customLevels.colors);

// Define custom log formats
const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length) {
      msg += ` | ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  })
);

const fileFormat = format.combine(format.timestamp(), format.json());

// Define transports
const logger = createLogger({
  levels: customLevels.levels,
  level: 'info',
  format: fileFormat, // Default format for all transports
  transports: [
    // Console Transport with Prettified Logs
    new transports.Console({
      format: consoleFormat,
    }),

    // Daily Rotate File Transport for Combined Logs
    new DailyRotateFile({
      filename: path.join('logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat, // Keep JSON format for file logs
    }),

    // Daily Rotate File Transport for Error Logs
    new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: fileFormat, // Keep JSON format for file logs
    }),
  ],
  exitOnError: false,
});

// If not in production, also log to the console with the prettified format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    })
  );
}

export function logInfo(message: string, meta?: any) {
  logger.info(message, meta);
}

export function logError(message: string, meta?: any) {
  logger.error(message, meta);
}

export function logWarning(message: string, meta?: any) {
  logger.warn(message, meta);
}

export function logDebug(message: string, meta?: any) {
  logger.debug(message, meta);
}
