// src/utils/extractCity.ts

/**
 * Extracts the city name from the alert header.
 * Assumes that the header contains only the city name in Hebrew.
 * Modify this function if the header contains more information.
 * @param header - The header string from the alert.
 * @returns The extracted city name.
 */
export function extractCityFromHeader(header: string): string {
  // If the header contains only the city name
  return header.trim();

  // If the header contains more information, implement parsing logic here.
  // For example, if the header is "CityName: Alert", use split:
  // const parts = header.split(':');
  // return parts[0].trim();
}
