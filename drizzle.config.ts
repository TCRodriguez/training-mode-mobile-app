import type { Config } from 'drizzle-kit';

export default {
  schema: "./src/db/schemas/*.ts",
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
  dbCredentials: {
    url: '',
  },
  migrations: {
    prefix: 'timestamp'
  }
} satisfies Config;
