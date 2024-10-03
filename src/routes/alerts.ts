// src/routes/alerts.ts

import { Router, Request, Response } from 'express';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger';
import dotenv from 'dotenv';
import { AlertItem, AlertResponse } from '../types';
import { getCityFromCoordinates } from '../utils/geocode';
import { extractCityFromHeader } from '../utils/extractCity';

dotenv.config();

const router = Router();

/**
 * Fetches missile alerts from the external API and filters them based on the user's city.
 */
router.get('/', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  // Validate query parameters
  if (!lat || !lon) {
    res
      .status(400)
      .json({ error: 'Missing latitude or longitude in query parameters.' });
    logInfo('Missing geolocation data', {
      endpoint: '/alerts',
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
      endpoint: '/alerts',
      status: 400,
      details: 'lat or lon query parameter is not a valid number.',
    });
    return;
  }

  // Determine user's city
  const userCity = await getCityFromCoordinates(latitude, longitude);

  if (!userCity) {
    res
      .status(500)
      .json({ error: 'Unable to determine city from geolocation data.' });
    logInfo('Geocoding failed', {
      endpoint: '/alerts',
      status: 500,
      details: `Could not determine city for lat=${latitude}, lon=${longitude}`,
    });
    return;
  }

  try {
    const apiUrl = process.env.ALERT_API_URL || '';
    if (!apiUrl) {
      throw new Error('ALERT_API_URL is not defined in environment variables.');
    }

    const response = await axios.get<AlertResponse>(apiUrl, {
      headers: {
        Referer: 'https://www.prog.co.il/',
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: 5000, // 5 seconds timeout
    });

    const { data } = response;

    // Validate response structure
    if (!data || !data.items) {
      throw new Error('Invalid response format from ALERT_API_URL.');
    }

    // Extract city from each alert's header and filter based on user's city
    const relevantAlerts: AlertItem[] = data.items.filter((alert) => {
      const alertCity = extractCityFromHeader(alert.header);
      return alertCity.toLowerCase() === userCity.toLowerCase();
    });

    if (relevantAlerts.length === 0) {
      logInfo("No missile alerts for the user's city", {
        endpoint: '/alerts',
        userCity,
      });
    } else {
      logInfo('Missile alerts found for city', {
        endpoint: '/alerts',
        status: response.status,
        userCity,
        data: relevantAlerts,
      });
    }

    res.json(relevantAlerts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logError('Error fetching data from Pikud HaOref API', {
        endpoint: '/alerts',
        error: error.message,
      });

      res
        .status(500)
        .json({ error: 'Error fetching data from Pikud HaOref API' });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
