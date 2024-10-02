// src/types/node-geocoder.d.ts

import 'node-geocoder';

declare module 'node-geocoder' {
  interface OpenStreetMapOptions extends BaseOptions {
    headers?: { [key: string]: string };
  }
}
