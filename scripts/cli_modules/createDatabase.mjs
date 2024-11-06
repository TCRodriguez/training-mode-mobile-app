import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.DATABASE_DIRECTORY_PATH;

export const createDatabase = async () => {
  console.log('createDatabase');
  if (fs.existsSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`)) {
    console.log(`Database file already exists at: ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
    process.exit(1);
  } else {
    console.log(`Database file ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db does not exist.`);
  }

  try {

    const db = new Database(`assets/${DATABASE_NAME}.db`);
    db.pragma('foreign_keys = ON');

    console.log('Database file created');
  } catch (error) {
    console.error('Error opening database:', error);
    process.exit(1);
  }
}
