import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { checkIfDatabaseExists } from '../utils.mjs';
import hitZonesJSON from '../../../assets/data/HitZones.json' assert { type: "json" };
import { dbInit } from '../utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.DATABASE_DIRECTORY_PATH;


export const seedHitZones = async () => {
  checkIfDatabaseExists();

  const now = new Date().toISOString();

  const hitZonesData = hitZonesJSON.map(hitZone => {
    return {
      zone: hitZone.zone,
      createdAt: now,
      updatedAt: now,
    }
  });

  try {
    const db = await dbInit();

    const insertHitZonesStatement = db.prepare(`INSERT INTO hit_zones (zone, created_at, updated_at) VALUES (@zone, @createdAt, @updatedAt)`);
    const insertHitZonesTx = db.transaction((hitZones) => {
      for (const hitZone of hitZones) {
        const hitZoneToBeInserted = {
          zone: hitZone.zone,
          createdAt: now,
          updatedAt: now,
        }

        const doesHitZoneExist = db.prepare(`SELECT * FROM hit_zones WHERE zone = ?`).get(hitZone.zone);
        if (doesHitZoneExist) {
          console.log('Hit zone already exists:', hitZone.zone);
        } else {
          console.log('hitZoneToBeInserted:', hitZoneToBeInserted);
          insertHitZonesStatement.run(hitZoneToBeInserted);
        }
      }
    });

    insertHitZonesTx(hitZonesData);
  } catch (error) {
    console.log(error);
  }
}
