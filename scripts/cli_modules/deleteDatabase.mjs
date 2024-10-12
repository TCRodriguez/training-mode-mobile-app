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

export const deleteDatabase = async () => {
  console.log('deleteDatabase');
  if (fs.existsSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`)) {
    const answer = await confirm({ message: `Are you sure you want to delete the database file: ${DATABASE_NAME}.db?` });

    if (answer === true) {
      try {
        fs.unlinkSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
        console.log(`Database file ${DATABASE_NAME}.db deleted successfully.`);
      } catch (error) {
        console.error('Error deleting the database:', error);
      }
    } else {
      console.log('Database deletion cancelled.');
    }

    return;
  } else {
    console.log(`Database file ${DATABASE_NAME}.db does not exist.`);
    process.exit(1);
  }
};
