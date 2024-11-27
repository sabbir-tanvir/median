import pkg from 'pg'; // Import the entire pg package
const { Client } = pkg; // Extract Client from the imported package

import { Hono } from 'hono';
import { Context } from 'hono';
import { jwt, sign } from 'hono/jwt';

// Define your PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from the environment
});

client.connect(); // Connect to the database

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.post('/api/v1/signup', async (c: Context) => {
  try {
    const body = await c.req.json();

    // Insert user into the database using SQL query
    const result = await client.query(
      'INSERT INTO "User" (email, password) VALUES ($1, $2) RETURNING id, email',
      [body.email, body.password]
    );
    
    const user = result.rows[0]; // Get the inserted user

    // Create a JWT token for the user
    const token = sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
    });
  } catch (error) {
    console.error('Error in /api/v1/signup:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.post('/api/v1/login', (c) => {
  return c.text('Hello Hono!');
});

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!');
});

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!');
});

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!');
});

export default app;
