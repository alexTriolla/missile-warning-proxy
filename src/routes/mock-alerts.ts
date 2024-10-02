// src/routes/mock-alerts.ts

import { Router, Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';
import { AlertItem } from '../types';
import { getCityFromCoordinates } from '../utils/geocode';
import { extractCityFromHeader } from '../utils/extractCity';

const router = Router();

// Mock data to simulate missile alerts
const mockAlertItems: AlertItem[] = [
  {
    id: '17849',
    alertid: '10010411011384',
    time: '2024-10-01 16:11:04',
    category: 'MissileAlert',
    header: 'תל אביב', // "Tel Aviv" in Hebrew
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
    header: 'ירושלים', // "Jerusalem" in Hebrew
    text: 'היכנסו למרחב המוגן ושהו בו 10 דקות',
    ttlseconds: '59',
    redwebno: '1405',
    title: 'ירי רקטות וטילים',
  },
  // Add more mock alerts with different cities as needed
];

/**
 * Function to create the route handler with encapsulated state.
 * It triggers alerts based on a random call limit.
 */
function createMockAlertHandler() {
  let callCount = 0;
  let randomLimit = getRandomLimit();

  function getRandomLimit(): number {
    return Math.floor(Math.random() * 2) + 2; // Random 2-3 times
  }

  return async (req: Request, res: Response): Promise<void> => {
    callCount++;

    const { lat, lon } = req.query;

    // Validate query parameters
    if (!lat || !lon) {
      res
        .status(400)
        .json({ error: 'Missing latitude or longitude in query parameters.' });
      logInfo('Missing geolocation data', {
        endpoint: '/mock-alerts',
        status: 400,
        details: 'lat or lon query parameter is missing.',
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ error: 'Invalid latitude or longitude values.' });
      logInfo('Invalid geolocation data', {
        endpoint: '/mock-alerts',
        status: 400,
        details: 'lat or lon query parameter is not a valid number.',
      });
      return;
    }

    const userCity = await getCityFromCoordinates(latitude, longitude);

    if (!userCity) {
      res
        .status(500)
        .json({ error: 'Unable to determine city from geolocation data.' });
      logError('Geocoding failed', {
        endpoint: '/mock-alerts',
        status: 500,
        details: `Could not determine city for lat=${latitude}, lon=${longitude}`,
      });
      return;
    }

    if (callCount >= randomLimit) {
      // Filter alerts relevant to the user's city
      const relevantAlerts = mockAlertItems.filter((alert) => {
        const alertCity = extractCityFromHeader(alert.header);
        return alertCity.toLowerCase() === userCity.toLowerCase();
      });

      const mockResponse = {
        date: new Date().toUTCString(),
        status: 1,
        items: relevantAlerts,
      };

      logInfo('Triggered mock missile alert', {
        endpoint: '/mock-alerts',
        status: 200,
        message: `Triggered mock missile alert for city: ${userCity} after ${callCount} calls`,
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

    logInfo('No missile alert triggered', {
      endpoint: '/mock-alerts',
      callCount,
      nextTriggerIn: randomLimit - callCount,
    });

    res.json(noAlertsResponse);
  };
}

// Attach the handler to the GET '/mock-alerts' route
router.get('/', createMockAlertHandler());

export default router;
