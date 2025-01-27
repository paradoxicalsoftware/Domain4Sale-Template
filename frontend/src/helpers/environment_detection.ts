export const isDev = import.meta.env.MODE === "development";

// For sending api requests to local development worker or production cloudflare worker
export const baseUrl = isDev ? "http://localhost:8787" : 'https://domain4sale.workers.dev'; // TODO: Change to actual worker
