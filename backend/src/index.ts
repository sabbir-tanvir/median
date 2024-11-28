import { Client } from 'pg';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

app.post('/api/v1/signup', async (c) => {
  const client = new Client({
    connectionString: c.env.DATABASE_URL,
  });

  await client.connect();

  const body = await c.req.json();
  try {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const values = [body.email, body.password];
    const res = await client.query(query, values);

    const userId = res.rows[0].id;
    const jwt = await sign({ id: userId }, c.env.JWT_SECRET);

    await client.end();

    return c.json({ jwt });
  } catch (e) {
    console.error('Error while signing up:', e);
    await client.end();
    c.status(403);
    return c.json({ error: 'error while signing up' });
  }
});


export default app;
