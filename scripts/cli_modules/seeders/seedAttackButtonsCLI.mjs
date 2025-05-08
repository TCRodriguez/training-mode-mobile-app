import dotenv from 'dotenv';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { checkIfDatabaseExists } from '../utils.mjs';
import { dbInit } from '../utils.mjs';
import { traverseDirectoryAndGetFiles, readJsonFiles } from '../getJsonData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedAttackButtons = async () => {
  checkIfDatabaseExists();

  const now = new Date().toISOString();

  const jsonFiles = await traverseDirectoryAndGetFiles('data/gameData', [], 'AttackButtons.json');
  const attackButtonsData = await readJsonFiles(jsonFiles);

  try {
    const db = await dbInit();

    const selectGameStatement = db.prepare(`SELECT * FROM games WHERE title = ?`);
    const insertAttackButtonsStatement = db.prepare(`
      INSERT INTO attack_buttons (name, game_shorthand, button_count, game_id, created_at, updated_at)
      VALUES (@name, @gameShorthand, @buttonCount, @gameId, @createdAt, @updatedAt)
    `);

    const insertAttackButtonsTx = db.transaction((attackButtonGroups) => {

      for (const attackButtonGroup of attackButtonGroups) {
        const game = selectGameStatement.get(attackButtonGroup[0].game);
        console.log('-------------------');
        console.log('game:', game);
        // console.log('attackButtonGroup:', attackButtonGroup);
        if (!game) {
          console.log('Game not found:', attackButtonGroup[0].game);
        } else {
          for (const attackButton of attackButtonGroup) {
            const attackButtonToBeInserted = {
              name: attackButton.name,
              gameShorthand: attackButton.game_shorthand,
              gameId: game.id,
              buttonCount: attackButton.button_count,
              createdAt: now,
              updatedAt: now,
            }

            const doesAttackButtonExist = db.prepare(`SELECT * FROM attack_buttons WHERE name = ? AND game_id = ?`).get(attackButton.name, game.id);
            if (doesAttackButtonExist) {
              // console.log('Attack button already exists:', attackButton.name);
            } else {
              // console.log('attackButtonToBeInserted', attackButtonToBeInserted);
              insertAttackButtonsStatement.run(attackButtonToBeInserted);
            }
          }
        }
      }
    });

    insertAttackButtonsTx(attackButtonsData);
  } catch (error) {
    console.log(error);
  }
}
