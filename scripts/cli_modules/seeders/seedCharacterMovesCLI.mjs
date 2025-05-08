import dotenv from 'dotenv';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { traverseDirectoryAndGetFiles, readJsonFiles } from '../getJsonData.mjs';
import { dbInit, checkIfDatabaseExists } from '../utils.mjs';
import util from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedCharacterMoves = async () => {
  checkIfDatabaseExists();

  const jsonFiles = await traverseDirectoryAndGetFiles('data/gameData', [], 'characters');
  const characterData = await readJsonFiles(jsonFiles);

  const now = new Date().toISOString();
  const db = await dbInit();

  const selectGameStatement = db.prepare(`SELECT * FROM games WHERE title = ?`);
  const selectCharacterStatement = db.prepare(`SELECT * FROM characters WHERE name = ? AND game_id = ?`);

  const insertCharacterMoveStatement = db.prepare(`INSERT INTO character_moves (name, character_id, game_id, resource_gain, resource_cost, meter_cost, meter_gain, hit_count, ex_hit_count, damage, category, type, startup_frames, active_frames, recovery_frames, frames_on_hit, frames_on_block, frames_on_counter_hit, move_list_number, created_at, updated_at) VALUES (@name, @characterId, @gameId, @resourceGain, @resourceCost, @meterCost, @meterGain, @hitCount, @exHitCount, @damage, @category, @type, @startupFrames, @activeFrames, @recoveryFrames, @framesOnHit, @framesOnBlock, @framesOnCounterHit, @moveListNumber, @createdAt, @updatedAt)`);
  const insertCharacterMovesTx = db.transaction((characters) => {
    return new Promise((resolve, reject) => {
      try {
        for (const character of characters) {
          if (character[0].moves.length === 1) {
            console.log('No moves found in JSON file for:', character[0].name);
            continue;
          }

          const gameFromDB = selectGameStatement.get(character[0].game);
          const characterFromDB = selectCharacterStatement.get(character[0].name, gameFromDB.id);
          console.log('-----------------------');
          console.log('game:', gameFromDB);
          console.log('characterFromDB:', characterFromDB);

          // Need to first populate the character-specific notations like `CLK` for Alisa's `Clockwork` move in Tekken 8 here before we insert the character moves
          const characterNotationsFromJSONFile = character[0].notations;
          const insertCharacterNotationStatement = db.prepare(`INSERT INTO game_notations (notation, description, game_id, character_id, notations_group, created_at, updated_at) VALUES (@notation, @description, @gameId, @characterId, @notationsGroup, @createdAt, @updatedAt)`);
          const insertCharacterNotationsTx = db.transaction((characterNotations) => {
            if (Object.keys(characterNotationsFromJSONFile).length === 0) {
              console.log('No character notations found for:', character[0].name);
            } else {
              for (const characterNotation in characterNotations) {

                const doesCharacterNotationExist = db.prepare(`SELECT * FROM game_notations WHERE notation = ? AND game_id = ?`).get(characterNotation, gameFromDB.id);
                if (doesCharacterNotationExist) {
                  console.log(`Character notation ${characterNotation} already exists for character ${character[0].name}`);
                  continue;
                } else {
                  const characterNotationToBeInserted = {
                    notation: characterNotation,
                    description: characterNotationsFromJSONFile[characterNotation],
                    gameId: gameFromDB.id,
                    characterId: characterFromDB.id,
                    //TODO: For some reason I have `notations_group` in the "root" level of the character JSON file, so this line works.
                    //TODO: Though perhaps it would be better to just do `notationsGroup: 'character'` here?
                    notationsGroup: character[0].notations_group,
                    createdAt: now,
                    updatedAt: now,
                  }

                  console.log('characterNotationToBeInserted:', characterNotationToBeInserted);

                  insertCharacterNotationStatement.run(characterNotationToBeInserted);
                }
              }
            }
          });
          insertCharacterNotationsTx(characterNotationsFromJSONFile);

          for (const characterMove of character[0].moves) {
            if (!gameFromDB) {
              console.log('Game not found:', character[0].game);
              process.exit(1);
            } else {
              if (!characterFromDB) {
                console.log('Character not found:', character[0].name);
                process.exit(1);
              } else {

                // Inserts the character move into the `character_moves` table
                const characterMoveFromDB = db.prepare(`SELECT * FROM character_moves WHERE name = ? AND character_id = ? AND game_id = ?`).get(characterMove.name, characterFromDB.id, gameFromDB.id);
                if (characterMoveFromDB) {
                  console.log('Character move already exists:', characterMove.name);
                  // continue;
                } else {

                  const characterMoveToBeInserted = {
                    name: characterMove.name,
                    characterId: characterFromDB.id,
                    gameId: gameFromDB.id,
                    resourceGain: characterMove.resource_gain,
                    resourceCost: characterMove.resource_cost,
                    meterCost: characterMove.meter_cost,
                    meterGain: characterMove.meter_gain,
                    hitCount: characterMove.hit_count,
                    exHitCount: characterMove.ex_hit_count,
                    damage: characterMove.damage,
                    category: characterMove.category,
                    type: characterMove.type,
                    startupFrames: characterMove.startup_frames,
                    activeFrames: characterMove.active_frames,
                    recoveryFrames: characterMove.recovery_frames,
                    framesOnHit: characterMove.frames_on_hit,
                    framesOnBlock: characterMove.frames_on_block,
                    framesOnCounterHit: characterMove.frames_on_counter_hit,
                    moveListNumber: characterMove.move_list_number,
                    createdAt: now,
                    updatedAt: now,
                  }
                  // console.log('characterMoveToBeInserted:', characterMoveToBeInserted);
                  insertCharacterMoveStatement.run(characterMoveToBeInserted);
                }

                // Fills in pivot tables for character move inputs (directional inputs, attack buttons, and notations)
                if (characterMoveFromDB) {
                  const insertCharacterMoveDirectionalInputStatement = db.prepare(`INSERT INTO character_move_directional_input (character_move_id, directional_input_id, order_in_move, created_at, updated_at) VALUES (@characterMoveId, @directionalInputId, @orderInMove, @createdAt, @updatedAt)`);
                  const insertAttackButtonCharacterMoveStatement = db.prepare(`INSERT INTO attack_button_character_move (attack_button_id, character_move_id, order_in_move, created_at, updated_at) VALUES (@attackButtonId, @characterMoveId, @orderInMove, @createdAt, @updatedAt)`);
                  const insertCharacterMoveGameNotationStatement = db.prepare(`INSERT INTO character_move_game_notation (character_move_id, game_notation_id, order_in_move, created_at, updated_at) VALUES (@characterMoveId, @gameNotationId, @orderInMove, @createdAt, @updatedAt)`);
                  const insertCharacterMoveInputsTransaction = db.transaction((characterMoveInputs) => {
                    for (let index = 0; index < characterMoveInputs.length; index++) {
                      let orderInMove = Math.floor(index + 1);
                      const characterMoveInput = characterMoveInputs[index];

                      // console.log(characterMoveInput.group);
                      // console.log(orderInMove, characterMoveInput);
                      if (characterMoveInput.group === 'directions') {
                        const directionalInputFromDB = db.prepare(`SELECT * FROM directional_inputs WHERE direction = ?`).get(characterMoveInput.input);
                        const characterMoveDirectionalInputFromDB = db.prepare(`SELECT * FROM character_move_directional_input WHERE character_move_id = ? AND directional_input_id = ? AND order_in_move = ?`).get(characterMoveFromDB.id, directionalInputFromDB.id, orderInMove);



                        // Checks to see if the directional input and it's order in the move already exists for the character move
                        if (characterMoveDirectionalInputFromDB) {
                          console.log(`'Directional Input <> Character Move <> Order in Move' record '${characterMoveInput.input}' for '${characterMoveFromDB.name}' already exists.`);
                          continue;
                        } else {
                          const characterMoveDirectionalInput = {
                            characterMoveId: characterMoveFromDB.id,
                            directionalInputId: directionalInputFromDB === undefined ? 9 : directionalInputFromDB.id,
                            orderInMove: orderInMove,
                            createdAt: now,
                            updatedAt: now,
                          }

                          try {
                            console.log('Inserting character move directional input:', characterMoveDirectionalInput);
                            insertCharacterMoveDirectionalInputStatement.run(characterMoveDirectionalInput);
                          } catch (error) {
                            console.error('Error inserting character move directional input:', error);
                          }
                        }
                      }

                      if (characterMoveInput.group === 'attacks') {
                        const attackButtonModel = db.prepare(`SELECT * FROM attack_buttons WHERE name = ?`).get(characterMoveInput.input);
                        const attackButtonCharacterMoveFromDB = db.prepare(`SELECT * FROM attack_button_character_move WHERE attack_button_id = ? AND character_move_id = ? AND order_in_move = ?`).get(attackButtonModel.id, characterMoveFromDB.id, orderInMove);

                        // Checks to see if the directional input and it's order in the move already exists for the character move
                        if (attackButtonCharacterMoveFromDB) {
                          console.log(`'Attack Button <> Character Move <> Order in Move' record '${characterMoveInput.input}' for '${characterMoveFromDB.name}' already exists.`);
                          continue;
                        } else {
                          // TODO: Add the `try/catch` like we did for the `directions` group above
                          const attackButtonCharacterMove = {
                            attackButtonId: attackButtonModel.id,
                            characterMoveId: characterMoveFromDB.id,
                            orderInMove: orderInMove,
                            createdAt: now,
                            updatedAt: now,
                          }

                          try {
                            console.log('Inserting attack button character move...', attackButtonCharacterMove);
                            insertAttackButtonCharacterMoveStatement.run(attackButtonCharacterMove);
                            console.log('Inserted attack button character move inserted.');
                          } catch (error) {
                            console.error('Error inserting attack button character move:', error);
                          }
                        }
                      }

                      if (characterMoveInput.group === 'notations') {
                        const gameNotationModel = db.prepare(`SELECT * FROM game_notations WHERE notation = ?`).get(characterMoveInput.notation);
                        const characterMoveGameNotationFromDB = db.prepare(`SELECT * FROM character_move_game_notation WHERE character_move_id = ? AND game_notation_id = ? AND order_in_move = ?`).get(characterMoveFromDB.id, gameNotationModel.id, orderInMove);

                        if (characterMoveGameNotationFromDB) {
                          console.log(`'Game Notation <> Character Move <> Order in Move' record '${characterMoveInput.notation}' for '${characterMoveFromDB.name}' already exists.`);
                          continue;
                        } else {
                          const characterMoveGameNotationToBeInserted = {
                            characterMoveId: characterMoveFromDB.id,
                            gameNotationId: gameNotationModel.id,
                            orderInMove: orderInMove,
                            createdAt: now,
                            updatedAt: now,
                          }

                          try {
                            console.log('Inserting character move game notation:', characterMoveGameNotationToBeInserted);
                            insertCharacterMoveGameNotationStatement.run(characterMoveGameNotationToBeInserted);
                            console.log('Inserted character move game notation.');
                          } catch (error) {
                            console.error('Error inserting character move game notation:', error);
                          }
                        }
                      }
                    }
                  });
                  insertCharacterMoveInputsTransaction(characterMove.inputs);
                }

                // Inserts character move conditions and character move <> character move conditions
                if (characterMoveFromDB) {
                  const insertCharacterMoveConditionStatement = db.prepare(`INSERT INTO character_move_conditions (condition, game_id, created_at, updated_at) VALUES (@condition, @gameId, @createdAt, @updatedAt)`);
                  const insertCharacterMoveConditionsTransaction = db.transaction((characterMoveConditions) => {
                    return new Promise((resolve, reject) => {
                      try {
                        if (characterMoveConditions === undefined) {
                          console.log('`conditions` is undefined for:', characterMove.name);
                        } else {
                          // Loops through and inserts character move condition if it doesn't already exist
                          for (const characterMoveCondition of characterMoveConditions) {
                            if (characterMoveCondition === '') {
                              console.log('Empty condition found.');
                              continue;
                            }

                            const characterMoveConditionFromDB = db.prepare(`SELECT * FROM character_move_conditions WHERE condition = ? AND game_id = ?`).get(characterMoveCondition, gameFromDB.id);

                            if (characterMoveConditionFromDB) {
                              console.log(`Character move condition '${characterMoveCondition}' already exists.`);
                              continue;
                            } else {
                              const characterMoveConditionToBeInserted = {
                                condition: characterMoveCondition,
                                gameId: gameFromDB.id,
                                createdAt: now,
                                updatedAt: now,
                              }

                              try {
                                console.log('Inserting character move condition:', characterMoveConditionToBeInserted);
                                insertCharacterMoveConditionStatement.run(characterMoveConditionToBeInserted);
                                console.log('Inserted character move condition.');
                              } catch (error) {
                                console.error('Error inserting character move condition:', error);
                              }
                            }
                          }
                        }

                        resolve();
                      } catch (error) {
                        console.log('Error inserting character move conditions:', error);
                        reject();
                      }
                    })
                  });

                  const insertCharacterMoveCharacterMoveConditionStatement = db.prepare(`INSERT INTO character_move_character_move_condition (character_move_id, character_move_condition_id, created_at, updated_at) VALUES (@characterMoveId, @characterMoveConditionId, @createdAt, @updatedAt)`);
                  const insertCharacterMoveCharacterMoveConditionTranscation = db.transaction((characterMoveConditions) => {
                    if (characterMoveConditions === undefined) {
                      console.log('`conditions` is undefined for:', characterMove.name);
                    } else {
                      for (const characterMoveCondition of characterMoveConditions) {
                        if (characterMoveCondition === '') {
                          console.log('Empty condition found.');
                          continue;
                        }

                        const characterMoveConditionFromDB = db.prepare(`SELECT * FROM character_move_conditions WHERE condition = ? AND game_id = ?`).get(characterMoveCondition, gameFromDB.id);
                        const characterMoveCharacterMoveConditionFromDB = db.prepare(`SELECT * FROM character_move_character_move_condition WHERE character_move_id = ? AND character_move_condition_id = ?`).get(characterMoveFromDB.id, characterMoveConditionFromDB.id);

                        if (characterMoveCharacterMoveConditionFromDB) {
                          console.log(`Character move condition '${characterMoveCondition}' already exists for character move '${characterMove.name}'`);
                          continue;
                        } else {
                          const characterMoveCharacterMoveConditionToBeInserted = {
                            characterMoveId: characterMoveFromDB.id,
                            characterMoveConditionId: characterMoveConditionFromDB.id,
                            createdAt: now,
                            updatedAt: now,
                          }

                          try {
                            console.log('Inserting character move character move condition:', characterMoveCharacterMoveConditionToBeInserted);
                            insertCharacterMoveCharacterMoveConditionStatement.run(characterMoveCharacterMoveConditionToBeInserted);
                            console.log('Inserted character move character move condition.');
                          } catch (error) {
                            console.error('Error inserting character move character move condition:', error);
                          }
                        }
                      }
                    }
                  });

                  insertCharacterMoveConditionsTransaction(characterMove.conditions)
                    .then(() => {
                      insertCharacterMoveCharacterMoveConditionTranscation(characterMove.conditions);
                    })
                }
              }
            }
          }
        }

        resolve();
      } catch (error) {
        console.error('Error inserting character moves:', error);
        reject();
      }
    })
  });

  const insertCharacterMoveFollowUpStatement = db.prepare(`INSERT INTO character_move_follow_ups (character_move_id, follow_up_character_move_id, created_at, updated_at) VALUES (@characterMoveId, @followUpCharacterMoveId, @createdAt, @updatedAt)`);
  const insertCharacterMoveFollowUpsTransaction = db.transaction((characters) => {
    for (const character of characters) {
      const gameFromDB = selectGameStatement.get(character[0].game);
      for (const characterMove of character[0].moves) {
        if (!Object.keys(characterMove).includes('follow_up_to')) {
          console.log('No `follow_up_to` property found for:', characterMove.name);
        } else {
          for (let index = 0; index < characterMove.follow_up_to.length; index++) {
            if (characterMove.follow_up_to[index] === '') {
              console.log('Empty follow up found.');
              continue;
            }

            const parentCharacterMove = db.prepare(`SELECT * FROM character_moves WHERE name = ? AND game_id = ?`).get(characterMove.follow_up_to[index], gameFromDB.id);
            const childCharacterMove = db.prepare(`SELECT * FROM character_moves WHERE name = ? AND game_id = ?`).get(characterMove.name, gameFromDB.id);
            console.log('-------------------');

            if (!parentCharacterMove) {
              console.log('Parent character move not found:', characterMove.follow_up_to[index]);
            } else {
              if (!childCharacterMove) {
                console.log('Child character move not found:', characterMove.name);
              } else {
                const characterMoveFollowUpFromDB = db.prepare(`SELECT * FROM character_move_follow_ups WHERE character_move_id = ? AND follow_up_character_move_id = ?`).get(parentCharacterMove.id, childCharacterMove.id);
                if (characterMoveFollowUpFromDB) {
                  console.log(`Character move follow up '${childCharacterMove.name}' already exists for character move '${parentCharacterMove.name}'`);
                  continue;
                } else {
                  const characterMoveFollowUpToBeInserted = {
                    characterMoveId: parentCharacterMove.id,
                    followUpCharacterMoveId: childCharacterMove.id,
                    createdAt: now,
                    updatedAt: now,
                  }

                  try {
                    console.log('Inserting character move follow up:', characterMoveFollowUpToBeInserted);
                    insertCharacterMoveFollowUpStatement.run(characterMoveFollowUpToBeInserted);
                    console.log('Inserted character move follow up.');
                  } catch (error) {
                    console.error('Error inserting character move follow up:', error);
                  }
                }
              }
            }
          }
        }
      }
    }

  });

  insertCharacterMovesTx(characterData)
    .then(() => {
      console.log('Character moves inserted successfully.');
      insertCharacterMoveFollowUpsTransaction(characterData);
    })
}

