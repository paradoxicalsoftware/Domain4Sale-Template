declare namespace Hono {
	interface Env {
		environment: string;
	}
}
export interface Message {
	id: number; // Unique identifier for each message
	domain: string; // Domain name the message is about
	name?: string; // Name or business of the sender (optional)
	email: string; // Email address of the sender
	message?: string; // Optional message from the sender
	created_at: string; // Timestamp of submission
}

/* export interfaces, etc */
