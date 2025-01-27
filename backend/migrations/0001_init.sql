-- Migration number: 0001 	 2025-01-27T16:21:01.522Z
-- Create the `messages` table
CREATE TABLE messages (
						  id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each message
						  domain TEXT NOT NULL,         -- Domain name the message is about
						  name TEXT,                    -- Name or business of the sender
						  email TEXT NOT NULL,          -- Email address of the sender
						  message TEXT,                         -- Optional message from the sender
						  created_at TEXT -- Timestamp of submission
);
