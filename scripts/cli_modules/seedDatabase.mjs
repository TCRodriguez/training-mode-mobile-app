import dotenv from 'dotenv';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { seedGames } from './seeders/seedGamesCLI.mjs';
import { seedCharacters } from './seeders/seedCharactersCLI.mjs';
import { seedDirectionalInputs } from './seeders/seedDirectionalInputsCLI.mjs';
import { seedGameNotations } from './seeders/seedGameNotationsCLI.mjs';
import { seedAttackButtons } from './seeders/seedAttackButtonsCLI.mjs';
import { seedHitZones } from './seeders/seedHitZonesCLI.mjs';
import { seedCharacterMoves } from './seeders/seedCharacterMovesCLI.mjs';
import { checkIfDatabaseExists } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedDatabase = async (seeder = 'all') => {
  checkIfDatabaseExists();

  try {
    if (seeder === 'all') {

      // TODO: Need to figure out how to catch any "silent" errors and prevent the entire seeding action from happening.
      // If there is an error in `seedGameNotations`, `seedDirectionalInputs` should not actually insert anything into the DB.
      // I think the way it works is that a "temp" DB file is created and then the data is inserted into the DB. If there is an error, the temp DB file is deleted
      // and the original DB file is not touched.
      // For now, I'm just throwing an error in the readJsonFiles function in getJsonData.mjs to catch any JSON file errors
      // which is what was happening (KOFXVAttackButtons had a comma at the end)

      console.log('All seeders running...');

      await seedDirectionalInputs();
      await seedHitZones();
      await seedGames();
      await seedAttackButtons();
      await seedCharacters();
      await seedCharacterMoves();
      await seedGameNotations();
    } else if (seeder === 'games') {
      console.log('Games seeder running...');
      await seedGames();
    } else if (seeder === 'characters') {
      console.log('Characters seeder running...');
      await seedCharacters();
    } else if (seeder === 'directionalInputs') {
      console.log('Directional Inputs seeder running...');
      await seedDirectionalInputs();
    } else if (seeder === 'gameNotations') {
      console.log('Game Notations seeder running...');
      await seedGameNotations();
    } else if (seeder === 'attackButtons') {
      console.log('Attack Buttons seeder running...');
      await seedAttackButtons();
    } else if (seeder === 'hitZones') {
      console.log('Hit Zones seeder running...');
      await seedHitZones();
    } else if (seeder === 'characterMoves') {
      console.log('Character Moves seeder running...');
      await seedCharacterMoves();
    } else {
      console.log('Invalid seeder argument. Please use one of the following: all, games, characters, directionalInputs, gameNotations, attackButtons');
    }
  } catch (error) {
    console.error(error);
  }

  return;
}

