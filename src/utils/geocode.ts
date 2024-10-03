import axios from 'axios';
import dotenv from 'dotenv';
import { logError } from './logger'; // Ensure correct import path

dotenv.config();

// In-memory cache for storing geocoding results
const cache: Record<string, { value: string; expiry: number }> = {};

/**
 * Converts latitude and longitude to a city name in Hebrew.
 * Utilizes an in-memory cache to minimize external API calls.
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
    // Check if result is already cached and not expired
    const cachedData = cache[cacheKey];
    const currentTime = Date.now();
    if (cachedData && cachedData.expiry > currentTime) {
      return cachedData.value;
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
        // Cache the result with a 1-hour expiration
        cache[cacheKey] = {
          value: cityName,
          expiry: currentTime + 3600 * 1000, // 1 hour
        };
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
