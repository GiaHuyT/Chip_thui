// Prisma 7 configuration file
// Set DATABASE_URL to your PostgreSQL connection string, e.g.
// postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB>?schema=public
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // Ensure you set DATABASE_URL in environment
    url: process.env.DATABASE_URL ?? '',
  },
});