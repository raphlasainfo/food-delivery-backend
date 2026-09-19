import { onRequest } from 'firebase-functions/v2/https';
import app from './src/server.js';

// Expose your Express app without needing external secrets
export const api = onRequest(
  {
    cors: true,
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  app
);