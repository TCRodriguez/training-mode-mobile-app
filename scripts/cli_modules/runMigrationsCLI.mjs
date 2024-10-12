import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.DATABASE_DIRECTORY_PATH;

export const runMigrations = async () => {
  const migrationsFolderPath = path.resolve(__dirname, '../../src/db/migrations');

  if (fs.existsSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`)) {
    console.log(`Database file exists at: ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
  } else {
    console.log(`Database file ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db does not exist.`);
    process.exit(1);
  }

  try {
    const sqlite = new Database(`${DATABASE_NAME}.db`);
    console.log('Database opened successfully.');
    const db = drizzle(sqlite);
    migrate(db, { migrationsFolder: migrationsFolderPath });

  } catch (error) {
    console.error('Error opening database:', error);
    return;
  }
}