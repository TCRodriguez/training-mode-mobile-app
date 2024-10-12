import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.DATABASE_DIRECTORY_PATH;

export const seedDatabase = async (seeder = 'all') => {
  if (fs.existsSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`)) {
    console.log(`Database file exists at: ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);

    if (seeder === 'all') {
      console.log('All seeders running...');

      await seedDirectionalInputs();
      await seedHitZones();
      await seedGames();
      await seedGameNotations();
      await seedAttackButtons();
      await seedCharacters();
      await seedCharacterMoves();
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
  } else {
    console.log(`Database file ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db does not exist.`);
    process.exit(1);
    // fs.mkdirSync(DATABASE_DIRECTORY_PATH);
  }

  return;
}
