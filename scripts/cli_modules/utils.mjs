import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.EXPO_PUBLIC_DEV_DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.EXPO_PUBLIC_DEV_DATABASE_DIRECTORY_PATH;

export const checkIfDatabaseExists = () => {
  if (fs.existsSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`)) {
    console.log(`Database file exists at: ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
  } else {
    console.log(`Database file ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db does not exist. Please create the DB file first.`);
    process.exit(1);
  }
}

export const dbInit = async () => {
  checkIfDatabaseExists();

  try {
    const db = new Database(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
    db.pragma('foreign_keys = ON');

    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    process.exit(1);
  }
}

export const checkIfResourceExists = async (table, column, foreignKeys) => {
  const db = await dbInit();
  const doesResourceExist = db.prepare(`SELECT * FROM ${table} WHERE ${column} = ?`).get();

  if (doesResourceExist) {
    console.log(`${column} resouce already exists:`, column);
  } else {
    console.log('hitZoneToBeInserted:', hitZoneToBeInserted);
    insertHitZonesStatement.run(hitZoneToBeInserted);
  }

  return doesResourceExist;
}
