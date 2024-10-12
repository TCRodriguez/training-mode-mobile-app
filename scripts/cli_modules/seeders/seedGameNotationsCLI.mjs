import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { checkIfDatabaseExists } from '../utils.mjs';
import { dbInit } from '../utils.mjs';
import { traverseDirectoryAndGetFiles, readJsonFiles } from '../getJsonData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedGameNotations = async () => {
  checkIfDatabaseExists();

  const now = new Date().toISOString();

  const jsonFiles = await traverseDirectoryAndGetFiles('assets/data/gameData', [], 'Notations.json');
  const notationsData = await readJsonFiles(jsonFiles);

  try {
    const db = await dbInit();

    const selectGameStatement = db.prepare(`SELECT * FROM games WHERE title = ?`);
    const insertNotationsStatement = db.prepare(`
      INSERT INTO game_notations (notation, description, game_id, notations_group, created_at, updated_at)
      VALUES (@notation, @description, @gameId, @notationsGroup, @createdAt, @updatedAt)
    `);

    const insertNotationsTx = db.transaction((notationGroups) => {

      for (const notationGroup of notationGroups) {
        console.log('notation', notationGroup);
        console.log('-------------------');
        const game = selectGameStatement.get(notationGroup[0].game);
        console.log('game:', game);
        if (!game) {
          console.log('Game not found:', notation.game);
        } else {
          for (const notation of notationGroup) {

            const notationToBeInserted = {
              notation: notation.text,
              description: notation.description,
              gameId: game.id,
              notationsGroup: notation.group,
              createdAt: now,
              updatedAt: now,
            }
            console.log(notationToBeInserted);
            insertNotationsStatement.run(notationToBeInserted);
          }
        }
      }
    });

    insertNotationsTx(notationsData);
  } catch (error) {
    console.log(error);
  }
}
