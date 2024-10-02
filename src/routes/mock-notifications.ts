import { Router, Request, Response } from 'express';
import { logInfo } from '../utils/logger';

const router = Router();

// Define Notification interface
interface Notification {
  notificationId: string;
  time: number;
  threat: number;
  isDrill: boolean;
  cities: string[];
}

// Mock data to simulate missile alerts
const mockNotifications: Notification[] = [
  {
    notificationId: '315de9a7-fdb5-403a-be97-58e8a18b5e56',
    time: 1698668959,
    threat: 0,
    isDrill: false,
    cities: ['בית מאיר', 'נווה אילן', 'שורש', 'ירושלים - מערב', 'אבן ספיר'],
  },
  {
    notificationId: '6d6bd4d7-f64f-43d1-a443-cb39c36e6dd1',
    time: 1698668970,
    threat: 0,
    isDrill: false,
    cities: ['אפרת', 'נווה דניאל', 'ירושלים - דרום', 'אורה', 'עמינדב'],
  },
];

// Function to create the route handler with encapsulated state
function createMockNotificationHandler() {
  let callCount = 0;
  let randomLimit = getRandomLimit();

  function getRandomLimit(): number {
    return Math.floor(Math.random() * (5)) + 1;
  }

  return (req: Request, res: Response): void => {
    callCount++;

    if (callCount >= randomLimit) {
      logInfo({
        time: new Date().toISOString(),
        endpoint: '/mock-notifications',
        status: 200,
        message: `Triggered mock missile alert after ${callCount} calls`,
        data: mockNotifications,
      });
      callCount = 0;
      randomLimit = getRandomLimit();
      res.json(mockNotifications);
      return;
    }

    logInfo({
      message: 'No missile alert triggered',
      time: new Date().toISOString(),
      callCount,
      nextTriggerIn: randomLimit - callCount,
    });

    res.json([]);
  };
}

// Attach the handler to the GET '/' route
router.get('/', createMockNotificationHandler());

export default router;
