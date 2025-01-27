/**
 * Welcome to Cloudflare Workers! This is your worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { verifyRequestOrigin } from "oslo/request";
import "./types.d.ts";

type Env = {
	DB: D1Database; // D1 database binding from wrangler.toml
	environment: string; // "development" or "production"
};

const devDomains = ["http://localhost:5173", "http://localhost:8787"];
const prodDomains = ["https://domain4sale.com", "https://domain4sale.pages.dev"];

const app = new Hono<{ Bindings: Env }>();

// MIDDLEWARE
// ----------

// Options handler for preflight requests
app.options("*", async (c) => {
	return new Response(null, {
		headers: {
			"Access-Control-Allow-Origin": c.req.header("Origin") as string,
			"Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Max-Age": "86400",
			"Access-Control-Allow-Credentials": "true",
		},
	});
});

// CORS policy
app.use("*", async (c: Context, next) => {
	const corsMiddleware = cors({
		origin: c.env.environment === "development" ? devDomains : prodDomains,
		credentials: true,
	});
	await corsMiddleware(c, next);
});

// Cross Site Request Forgery Protection (CSRF)
app.use("*", async (c: Context, next) => {
	if (c.req.method === "GET") {
		return next();
	}

	const originHeader = c.req.header("Origin");
	const hostHeader = c.req.header("Host");

	const allowedHosts = c.env.environment === "development" ? devDomains : prodDomains;

	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, allowedHosts)) {
		return c.body(null, 403);
	}
	return next();
});

// ROUTES
// ------

// Handle POST /message to save form data
app.post("/message", async (c: Context) => {
	try {
		// Parse the incoming request body
		const body = await c.req.json();
		const { domain, name, email, message } = body;

		// Validate required fields
		if (!domain || !email) {
			return c.json({ error: "Domain and email are required." }, 400);
		}

		// Insert the message into the D1 database
		const db = c.env.DB;
		const query = `INSERT INTO messages (domain, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)`;
		const now = new Date().toISOString();

		await db.prepare(query).bind(domain, name, email, message, now).run();

		return c.json({ success: true, message: "Form submitted successfully." });
	} catch (error) {
		console.error("Error processing message:", error);
		return c.json({ error: "An error occurred while processing your request." }, 500);
	}
});

// EXPORT APP
// ----------

export default app;
