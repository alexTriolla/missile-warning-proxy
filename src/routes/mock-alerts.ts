import { Router, Request, Response } from 'express';
import { logInfo } from '../utils/logger';
import { AlertItem } from '../types';

const router = Router();

// Mock data to simulate missile alerts
const mockAlertItems: AlertItem[] = [
  {
    id: '17849',
    alertid: '10010411011384',
    time: '2024-10-01 16:11:04',
    category: 'MissileAlert',
    header: 'כאבול',
    text: 'היכנסו למרחב המוגן ושהו בו 10 דקות',
    ttlseconds: '59',
    redwebno: '1384',
    title: 'ירי רקטות וטילים',
  },
  {
    id: '17848',
    alertid: '10010411011405',
    time: '2024-10-01 16:11:04',
    category: 'MissileAlert',
    header: 'יסעור',
    text: 'היכנסו למרחב המוגן ושהו בו 10 דקות',
    ttlseconds: '59',
    redwebno: '1405',
    title: 'ירי רקטות וטילים',
  },
  // Add more mock alerts as needed
];

// Function to create the route handler with encapsulated state
function createMockAlertHandler() {
  let callCount = 0;
  let randomLimit = getRandomLimit();

  function getRandomLimit(): number {
    return Math.floor(Math.random() * 2) + 2; // Random 2-3 times
  }

  return (req: Request, res: Response): void => {
    callCount++;

    if (callCount >= randomLimit) {
      const mockResponse = {
        date: new Date().toUTCString(),
        status: 1,
        items: mockAlertItems,
      };

      logInfo({
        time: new Date().toISOString(),
        endpoint: '/mock-alerts',
        status: 200,
        message: `Triggered mock missile alert after ${callCount} calls`,
        data: mockResponse,
      });

      callCount = 0;
      randomLimit = getRandomLimit();
      res.json(mockResponse);
      return;
    }

    const noAlertsResponse = {
      date: new Date().toUTCString(),
      status: 1,
      items: [],
    };

    logInfo({
      message: 'No missile alert triggered',
      time: new Date().toISOString(),
      callCount,
      nextTriggerIn: randomLimit - callCount,
    });

    res.json(noAlertsResponse);
  };
}

// Attach the handler to the GET '/mock-alerts' route
router.get('/', createMockAlertHandler());

export default router;
