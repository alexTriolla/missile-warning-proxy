import { Router, Request, Response } from 'express';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger'; // Use correct logging functions

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://api.tzevaadom.co.il/notifications',
      {
        headers: {
          Referer: 'https://www.tzevaadom.co.il/',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    // Use logInfo instead of logToFile
    logInfo({
      time: new Date().toISOString(),
      endpoint: '/notifications',
      status: response.status,
      data: response.data,
    });

    res.json(response.data); // Send the response data back to the client
  } catch (error) {
    console.error('Error fetching data from Tzeva Adom API:', error);

    // Check if error is of type `Error` and use logError
    if (error instanceof Error) {
      logError({
        time: new Date().toISOString(),
        endpoint: '/notifications',
        status: 500,
        error: 'Error fetching data from Tzeva Adom API',
        details: error.message,
      });

      res
        .status(500)
        .json({ error: 'Error fetching data from Tzeva Adom API' });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
