import cron from 'node-cron';
import { env } from '../config/env.js';

// Render (free plan) puts the server to sleep after ~15 minutes without requests.
// Every 10 minutes the server sends a request to itself, so it stays awake.
export const scheduleKeepAlive = () => {
    // On Render the variable RENDER_EXTERNAL_URL is set automatically.
    // Locally it does not exist, so nothing runs (no need to wake up a local server).
    const url = env.RENDER_EXTERNAL_URL;
    if (!url) return;

    cron.schedule('*/10 * * * *', async () => {
        try {
            const response = await fetch(url);
            console.log(`Keep-alive ping: ${response.status}`);
        } catch (error) {
            console.error('Keep-alive ping failed:', error.message);
        }
    });
};
