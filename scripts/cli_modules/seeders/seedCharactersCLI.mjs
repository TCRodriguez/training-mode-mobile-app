import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { traverseDirectoryAndGetFiles, readJsonFiles } from '../getJsonData.mjs';
import { dbInit, checkIfDatabaseExists } from '../utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedCharacters = async () => {
  checkIfDatabaseExists();

  try {
    const jsonFiles = await traverseDirectoryAndGetFiles('data/gameData', [], 'characters');
    const characterData = await readJsonFiles(jsonFiles);
    // console.log('characterData:', characterData);


    const now = new Date().toISOString();

    try {
      const db = await dbInit();

      const selectGameStatement = db.prepare(`SELECT * FROM games WHERE title = ?`);
      const insertCharactersStatement = db.prepare(`INSERT INTO characters (name, archetype, game_id, created_at, updated_at) VALUES (@name, @archetype, @gameId, @createdAt, @updatedAt)`);
      const insertCharactersTx = db.transaction((characters) => {
        for (const character of characters) {
          const game = selectGameStatement.get(character[0].game);
          console.log('game:', game);
          if (!game) {
            console.log('Game not found:', character[0].game);
          } else {
            const characterToBeInserted = {
              name: character[0].name,
              archetype: character[0].archetype,
              gameId: game.id,
              createdAt: now,
              updatedAt: now,
            }

            insertCharactersStatement.run(characterToBeInserted);
            console.log('Inserted character:', character[0].name, 'for game:', character[0].game);
          }
        }
      });

      insertCharactersTx(characterData);
    } catch (error) {
      console.error('Error opening database:', error);
      return;
    }

    //
    //
    //
    //
    //
    //
    //
    // TODO: Make sure game exists before inserting character (through game_id)



  } catch (error) {
    console.error('Error opening database:', error);
    return;
  }






}
