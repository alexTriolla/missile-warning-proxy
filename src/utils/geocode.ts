// src/utils/geocode.ts

import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { logError } from './logger'; // Ensure correct import path

dotenv.config();

// Initialize Redis client
const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
  logError('Redis Client Error', { error: err.message });
});

// Connect to Redis
redisClient.connect();

/**
 * Converts latitude and longitude to a city name in Hebrew.
 * Utilizes Redis caching to minimize external API calls.
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns The city name in Hebrew or null if not found
 */
export async function getCityFromCoordinates(
  lat: number,
  lon: number
): Promise<string | null> {
  const cacheKey = `${lat},${lon}`;

  try {
    // Check if result is already cached in Redis
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Make reverse geocoding request to Nominatim
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          format: 'json',
          lat,
          lon,
          addressdetails: 1,
          accept_language: 'he', // Hebrew
        },
        headers: {
          'User-Agent': 'MissileWarningProxy/1.0 (your-email@example.com)', // Replace with your contact info
        },
      }
    );

    const data = response.data;

    if (data && data.address) {
      const cityName =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.hamlet ||
        data.address.county ||
        null;

      if (cityName) {
        // Cache the result in Redis with an expiration time (e.g., 1 hour)
        await redisClient.setEx(cacheKey, 3600, cityName);
        return cityName;
      }
    }

    return null;
  } catch (error: any) {
    console.error('Geocoding error:', error);
    logError('Geocoding error', { error: error.message });
    return null;
  }
}
