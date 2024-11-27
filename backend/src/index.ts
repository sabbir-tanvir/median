import { PrismaClient } from '@prisma/client/extension';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { Context } from 'hono';
import { jwt, sign } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.post('/api/v1/signup', async (c: Context) => {
  // Log the incoming request body
  try {
    const body = await c.req.json();
    console.log('Request Body:', body);

    // Initialize Prisma with Accelerate extension
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extend(withAccelerate());

    // Check if user creation works
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    console.log('User Created:', user);

    // Generate JWT token
    const token = sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
    });
  } catch (error) {
    console.error('Error in /api/v1/signup:', error);

    return c.json(
      {
        error: 'Something went wrong.',
        details: error.message,
      },
      500
    );
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
