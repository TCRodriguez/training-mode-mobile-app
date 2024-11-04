import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { checkIfDatabaseExists } from '../utils.mjs';
import directionalInputsJSON from '../../../assets/data/DirectionalInputs.json' assert { type: "json" };
import { dbInit } from '../utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.DATABASE_DIRECTORY_PATH;


export const seedDirectionalInputs = async () => {
  checkIfDatabaseExists();

  const now = new Date().toISOString();

  // const gamesData = gamesDataJSON.map((game) => {
  //   return {
  //     title: game.title,
  //     abbreviation: game.abbreviation,
  //     buttons: game.buttons,
  //     createdAt: now,
  //     updatedAt: now,
  //   };
  // });
  const directionalInputData = directionalInputsJSON.map(directionalInput => {
    return {
      direction: directionalInput.direction,
      game_shorthand: directionalInput.game_shorthand,
      numpad_notation: directionalInput.numpad_notation,
      createdAt: now,
      updatedAt: now,
    }
  });
  // console.log('directionalInputsJSON:', directionalInputsJSON);
  console.log('directionalInputData:', directionalInputData);

  try {

    const db = await dbInit();

    // const db = new Database(`${DATABASE_NAME}.db`);

    const insertDirecionalInputsStatement = db.prepare(`INSERT INTO directional_inputs (direction, game_shorthand, numpad_notation, created_at, updated_at) VALUES (@direction, @gameShorthand, @numpadNotation, @createdAt, @updatedAt)`);
    const insertDirectionalInputsTx = db.transaction((directionalInputs) => {
      for (const directionalInput of directionalInputs) {
        const directionalInputToBeInserted = {
          direction: directionalInput.direction,
          gameShorthand: directionalInput.game_shorthand,
          numpadNotation: directionalInput.numpad_notation,
          createdAt: now,
          updatedAt: now,
        }

        insertDirecionalInputsStatement.run(directionalInputToBeInserted);
        console.log('Inserted directional input:', directionalInput.direction);
      }
    });

    insertDirectionalInputsTx(directionalInputData);
  } catch (error) {
    console.log(error);
  }
}
