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

export const seedGameNotations = async () => {
  checkIfDatabaseExists();

  const now = new Date().toISOString();

  const jsonFiles = await traverseDirectoryAndGetFiles('data/gameData', [], 'Notations.json');
  const notationsData = await readJsonFiles(jsonFiles);

  try {
    const db = await dbInit();

    const selectGameStatement = db.prepare(`SELECT * FROM games WHERE title = ?`);

    const insertNotationsStatement = db.prepare(`
      INSERT INTO game_notations (notation, description, game_id, notations_group, created_at, updated_at)
      VALUES (@notation, @description, @gameId, @notationsGroup, @createdAt, @updatedAt)
    `);

    // Inserts base game notations
    const insertBaseGameNotationsTx = db.transaction((notationGroups) => {
      return new Promise((resolve, reject) => {
        try {
          for (const notationGroup of notationGroups) {
            console.log('-------------------');
            const game = selectGameStatement.get(notationGroup[0].game);
            // console.log('game:', game);
            if (!game) {
              console.log('Game not found:', notation.game);
            } else {
              for (const notation of notationGroup) {
                const gameNotationFromDB = db.prepare(`SELECT * FROM game_notations WHERE notation = ? AND game_id = ?`).get(notation.text, game.id);

                if (gameNotationFromDB) {
                  console.log('Game notation already exists:', notation.text);
                } else {

                  const notationToBeInserted = {
                    notation: notation.text,
                    description: notation.description,
                    gameId: game.id,
                    notationsGroup: notation.group,
                    createdAt: now,
                    updatedAt: now,
                  }

                  try {
                    console.log('test');
                    console.log('Inserting notation:', notationToBeInserted);
                    insertNotationsStatement.run(notationToBeInserted);
                    console.log('Inserted notation:', notation.text);
                  } catch (error) {
                    console.log('Error inserting notation:', error);
                  }
                }
              }
            }
          }
          resolve();
        } catch (error) {
          reject();
        }
      });
    });

    const insertAttackButtonAndDirectionalInputGameNotationsTx = db.transaction((notationGroups) => {
      // Inserts directional input game notations
      for (const notationGroup of notationGroups) {

        console.log('-------------------');
        const game = selectGameStatement.get(notationGroup[0].game);
        if (!game) {
          console.log('Game not found:', notation.game);
        } else {
          for (const notation of notationGroup) {

            // Inserts directional input game notations
            if (notation.group === 'directions') {
              const insertDirectionalInputGameNotationStatement = db.prepare(`INSERT INTO directional_input_game_notation (directional_input_id, game_notation_id, created_at, updated_at) VALUES (@directionalInputId, @gameNotationId, @createdAt, @updatedAt)`);

              for (const directionalInput of notation.directional_inputs) {
                console.log('-------------------');

                const directionalInputFromDB = db.prepare(`SELECT * FROM directional_inputs WHERE direction = ?`).get(directionalInput);
                const gameNotationFromDB = db.prepare(`SELECT * FROM game_notations WHERE notation = ? AND game_id = ?`).get(notation.text, game.id);

                const directionalInputGameNotationFromDB = db.prepare(`SELECT * FROM directional_input_game_notation WHERE directional_input_id = ? AND game_notation_id = ?`).get(directionalInputFromDB.id, gameNotationFromDB.id);

                // Ensures that both directional input and game notation exist before trying to insert directional input game notation
                if (!directionalInputFromDB || !gameNotationFromDB) {
                  console.log('Directional input or game notation does not exist:', directionalInputFromDB, gameNotationFromDB);
                  continue;
                } else {
                  if (directionalInputGameNotationFromDB) {
                    console.log('Directional input game notation already exists:', directionalInputGameNotationFromDB);
                    continue;
                  } else {
                    const directionalInputGameNotationToBeInserted = {
                      directionalInputId: directionalInputFromDB.id,
                      gameNotationId: gameNotationFromDB.id,
                      createdAt: now,
                      updatedAt: now,
                    }

                    try {
                      console.log('Inserting directional input game notation:', directionalInputGameNotationToBeInserted);
                      insertDirectionalInputGameNotationStatement.run(directionalInputGameNotationToBeInserted);
                      console.log('Inserted directional input game notation.');
                    } catch (error) {
                      console.log('Error inserting directional input game notation:', error);
                    }
                  }
                }
              }
            }

            // Inserts attack button game notations
            if (notation.group === 'attacks') {
              const insertAttackButtonGameNotationStatement = db.prepare(`INSERT INTO attack_button_game_notation (attack_button_id, game_notation_id, created_at, updated_at) VALUES (@attackButtonId, @gameNotationId, @createdAt, @updatedAt)`);
              for (const attackButton of notation.attack_buttons) {
                console.log('-------------------');

                const attackButtonFromDB = db.prepare(`SELECT * FROM attack_buttons WHERE name = ?`).get(attackButton);
                const gameNotationFromDB = db.prepare(`SELECT * FROM game_notations WHERE notation = ? AND game_id = ?`).get(notation.text, game.id);

                const attackButtonGameNotationFromDB = db.prepare(`SELECT * FROM attack_button_game_notation WHERE attack_button_id = ? AND game_notation_id = ?`).get(attackButtonFromDB.id, gameNotationFromDB.id);
                if (!attackButtonFromDB || !gameNotationFromDB) {
                  console.log('Attack button or game notation does not exist:', attackButtonFromDB, gameNotationFromDB);
                  continue;
                } else {
                  if (attackButtonGameNotationFromDB) {
                    console.log('Attack button game notation already exists:', attackButtonGameNotationFromDB);
                    continue;
                  } else {
                    const attackButtonGameNotationToBeInserted = {
                      attackButtonId: attackButtonFromDB.id,
                      gameNotationId: gameNotationFromDB.id,
                      createdAt: now,
                      updatedAt: now,
                    }

                    try {
                      console.log('Inserting attack button game notation...');
                      insertAttackButtonGameNotationStatement.run(attackButtonGameNotationToBeInserted);
                      console.log('Inserted attack button game notation:', attackButtonGameNotationToBeInserted);
                    } catch (error) {
                      console.log('Error inserting attack button game notation:', error);
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // We need to wait for the base game notations to be inserted before inserting attack button and directional input game notations
    await insertBaseGameNotationsTx(notationsData)
      .then(() => {
        console.log('Adding game notation pivot table data for attack buttons and directional inputs...');
        insertAttackButtonAndDirectionalInputGameNotationsTx(notationsData);
        console.log('Game notation pivot table data for attack buttons and directional inputs added successfully.');
      })
  } catch (error) {
    console.log(error);
  }
}

