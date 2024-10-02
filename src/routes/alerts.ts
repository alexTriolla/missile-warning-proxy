import { Router, Request, Response } from 'express';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger';
import dotenv from 'dotenv';
import { AlertResponse } from '../types';

dotenv.config();

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const response = await axios.get<AlertResponse>(
      process.env.ALERT_API_URL || '',
      {
        headers: {
          Referer: 'https://www.prog.co.il/',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    const { data } = response;

    if (data.items.length === 0) {
      logInfo({
        message: 'No missile alerts',
        time: new Date().toISOString(),
      });
    } else {
      logInfo({
        time: new Date().toISOString(),
        endpoint: '/alerts',
        status: response.status,
        data: data.items,
      });
    }

    res.json(data.items);
  } catch (error) {
    if (error instanceof Error) {
      logError({
        time: new Date().toISOString(),
        endpoint: '/alerts',
        error: 'Error fetching data from Pikud HaOref API',
        details: error.message,
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
