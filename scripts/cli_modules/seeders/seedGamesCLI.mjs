import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { traverseDirectoryAndGetFiles, readJsonFiles } from '../getJsonData.mjs';
import gamesDataJSON from '../../../assets/data/gameData/Games.json' assert { type: "json" };
import { checkIfDatabaseExists, dbInit } from '../utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.DATABASE_DIRECTORY_PATH;

export const seedGames = async () => {
  checkIfDatabaseExists();

  const now = new Date().toISOString();
  const gamesData = gamesDataJSON.map((game) => {
    return {
      title: game.title,
      abbreviation: game.abbreviation,
      buttons: game.buttons,
      createdAt: now,
      updatedAt: now,
    };
  });


  try {
    const db = await dbInit();





    const selectGamesStatement = db.prepare(`SELECT * FROM games`);
    const gamesInDB = await selectGamesStatement.all();



    const insertStatement = db.prepare(`INSERT INTO games (title, abbreviation, buttons, created_at, updated_at) VALUES (@title, @abbreviation, @buttons, @createdAt, @updatedAt)`);
    const insertGames = db.transaction((games) => {
      for (const game of games) {
        if (gamesInDB.some((gameInDB) => gameInDB.title === game.title)) {
          console.log(`The game '${game.title}' already exists in the database.`);
        } else {
          insertStatement.run(game);
        }
      }
    });

    insertGames(gamesData);
  } catch (error) {
    console.error('Error opening database:', error);
    return;
  }
}
