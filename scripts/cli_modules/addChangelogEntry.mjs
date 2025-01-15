import dotenv from 'dotenv';
import path from 'path';
import { confirm, select, input } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { dbInit } from './utils.mjs';
import gamesDataJSON from '../../data/gameData/Games.json' assert { type: "json" };
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const addChangelogEntry = async () => {
  const gameTitles = gamesDataJSON.map((game) => {
    return {
      name: game.title,
      value: game.title,
    };
  });

  const selectGameAnswer = await select({
    message: 'Select game',
    choices: gameTitles,
    loop: false,
  });

  const descriptionAnswer = await input({ message: 'Enter description' });
  const typeAnswer = await select({
    message: 'Select type',
    choices: [
      { name: 'Create', value: 'create' },
      { name: 'Update', value: 'update' },
      { name: 'Delete', value: 'delete' },
      { name: 'Leave blank', value: '' },
    ],
    loop: false,
  });

  const confirmEntryAnswer = await confirm({ message: `Add changelog entry?` });

  if (confirmEntryAnswer === true) {
    if (descriptionAnswer === '') {
      console.log('Description cannot be blank. Process cancelled.');
      process.exit(1);
    }

    try {
      const db = await dbInit();
      const now = new Date().toISOString();
      const insertChangelogEntryStatement = db.prepare(`INSERT INTO changelog (uuid, game, description, type, created_at) VALUES (@uuid, @game, @description, @type, @createdAt)`);
      const insertChangelogEntryTx = db.transaction((game, description, type) => {
        const changelogEntryToBeInserted = {
          uuid: uuidv4(),
          game: game,
          description: description,
          type: type,
          createdAt: now,
        }

        // TODO: LEFT OFF HERE
        insertChangelogEntryStatement.run(changelogEntryToBeInserted);

        // console.log('changelogEntryToBeInserted:', changelogEntryToBeInserted);
      });

      insertChangelogEntryTx(selectGameAnswer, descriptionAnswer, typeAnswer);
      console.log('Changelog entry added successfully.');
    } catch (error) {
      console.error('Error adding changelog entry:', error);
      process.exit(1);
    }
  } else {
    console.log('Changelog entry not added.');
  }

}

