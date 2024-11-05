import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { dbInit } from '../utils.mjs';
import directionalInputsJSON from '../../../data/DirectionalInputs.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const deleteResource = async (resource, resourceId) => {
  try {
    const db = await dbInit();

    if (resource === 'games') {
      console.log(`Deleting ${resource} with id:`, resourceId);
      const deleteResourceStatement = db.prepare(`DELETE FROM games WHERE id = ?`);
      deleteResourceStatement.run(resourceId);
    }

    return;
  } catch (error) {
    console.log(error);
  }
}
