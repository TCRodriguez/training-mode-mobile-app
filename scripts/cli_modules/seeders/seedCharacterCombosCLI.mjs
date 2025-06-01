import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { traverseDirectoryAndGetFiles, readJsonFiles } from '../getJsonData.mjs';
import { dbInit } from '../utils.mjs';
import characterComboJSON from '../../../data/gameData/Combos.json' assert { type: "json" };
import util from 'util';
import { dir } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedCharacterCombos = async () => {
    const db = await dbInit();

        // const jsonFiles = await traverseDirectoryAndGetFiles('data/gameData', [], 'characters');
        // const characterData = await readJsonFiles(jsonFiles);
        // console.log('characterData:', characterData);




    // return;

    const now = new Date().toISOString();

    const combosData = characterComboJSON.map((combo) => {
        return {
            name: combo.name,
            character: combo.character,
            game: combo.game,
            inputs: combo.inputs,
            createdAt: now,
            updatedAt: now,
        };
    });
    // console.log('combosData:', util.inspect(combosData, { depth: null, colors: true }));

    // return;

    combosData.forEach((comboData) => {
        const game = db.prepare(`SELECT * FROM games WHERE title = ?`).get(comboData.game);
        if (!game) {
            console.error('Game not found in DB:', comboData.game);
            process.exit(1);
        } else {
            console.log('game:', game);
        }

        const character = db.prepare(`SELECT * FROM characters WHERE name = ? AND game_id = ?`).get(comboData.character, game.id);
        if (!character) {
            console.error('Character not found in DB:', comboData.character, 'for game:', comboData.game);
            process.exit(1);
        } else {
            console.log('character:', character);
        }


        // Add combo record to character_combos table
        const insertCharacterComboStatement = db.prepare(`INSERT INTO character_combos (name, game_id, character_id, created_at, updated_at) VALUES (@name, @gameId, @characterId, @createdAt, @updatedAt)`);
        const insertCharacterComboTx = db.transaction((comboData) => {
            const comboToBeInserted = {
                name: comboData.name,
                gameId: game.id,
                characterId: character.id,
                createdAt: now,
                updatedAt: now,
            }
            console.log('comboToBeInserted:', comboToBeInserted);

            insertCharacterComboStatement.run(comboToBeInserted);
            console.log('Inserted combo:', comboToBeInserted.name, 'for game:', game.title);
        });

        const doesComboExistInDB = db.prepare(`SELECT * FROM character_combos WHERE name = ? AND game_id = ? AND character_id = ?`).get(comboData.name, game.id, character.id);
        if (doesComboExistInDB) {
            console.log(`Combo '${doesComboExistInDB.name}' already exists in DB for game:`, game.title);
        } else {
            insertCharacterComboTx(comboData);
        }

        const characterComboFromDB = db.prepare(`SELECT * FROM character_combos WHERE name = ? AND game_id = ? AND character_id = ?`).get(comboData.name, game.id, character.id);
        console.log('characterComboFromDB:', characterComboFromDB);

        // return;
        comboData.inputs.forEach((inputData) => {
            // Directions inputs in combo
            if(inputData.group === 'directions') {
                const directionalInputFromDB = db.prepare(`SELECT * FROM directional_inputs WHERE direction = ?`).get(inputData.input);

                if (!directionalInputFromDB) {
                    console.error('Directional input does not exist in DB.');
                    process.exit(1);
                }

                const insertDirectionalInputForCharacterComboStatement = db.prepare(`INSERT INTO character_combo_directional_input (character_combo_id, directional_input_id, order_in_combo, created_at, updated_at) VALUES (@characterComboId, @directionalInputId, @orderInCombo, @createdAt, @updatedAt)`);
                const insertDirectionalInputForCharacterComboTx = db.transaction((directionalInputData) => {
                    const characterComboDirectionalInputToBeInserted = {
                        characterComboId: characterComboFromDB.id,
                        directionalInputId: directionalInputFromDB.id,
                        orderInCombo: directionalInputData['order_in_combo'],
                        createdAt: now,
                        updatedAt: now,
                    }
                    console.log('characterComboDirectionalInputToBeInserted:', characterComboDirectionalInputToBeInserted);

                    insertDirectionalInputForCharacterComboStatement.run(characterComboDirectionalInputToBeInserted);
                    console.log('Inserted directional input to:', comboData.name, 'for game:', game.title);
                });

                const doesDirectionalInputExistInCombo = db.prepare(`SELECT * FROM character_combo_directional_input WHERE character_combo_id = ? AND directional_input_id = ? AND order_in_combo = ?`).get(characterComboFromDB.id, directionalInputFromDB.id, inputData['order_in_combo']);
                console.log('doesDirectionalInputExistInCombo:', doesDirectionalInputExistInCombo);
                if (doesDirectionalInputExistInCombo) {
                    console.log(`Directional input '${directionalInputFromDB.direction}' already exists in combo '${comboData.name}' for game:`, game.title);
                }
                else {
                    insertDirectionalInputForCharacterComboTx(inputData);
                }
            }

            // Attack inputs in combo
            if(inputData.group === 'attacks') {
                // TODO: Need to specify the game attack button belongs to
                const attackButtonFromDB = db.prepare(`SELECT * FROM attack_buttons WHERE name = ? AND game_id = ?`).get(inputData.input, game.id);
                console.log('attackButtonFromDB:', attackButtonFromDB);
                if (!attackButtonFromDB) {
                    console.error('Attack button does not exist in DB.');
                    process.exit(1);
                }

                const insertAttackButtonForCharacterComboStatement = db.prepare(`INSERT INTO attack_button_character_combo (character_combo_id, attack_button_id, order_in_combo, created_at, updated_at) VALUES (@characterComboId, @attackButtonId, @orderInCombo, @createdAt, @updatedAt)`);
                const insertAttackButtonForCharacterComboTx = db.transaction((attackButtonData) => {
                    const characterComboAttackButtonToBeInserted = {
                        characterComboId: characterComboFromDB.id,
                        attackButtonId: attackButtonFromDB.id,
                        orderInCombo: attackButtonData['order_in_combo'],
                        createdAt: now,
                        updatedAt: now,
                    }
                    console.log('characterComboAttackButtonToBeInserted:', characterComboAttackButtonToBeInserted);

                    insertAttackButtonForCharacterComboStatement.run(characterComboAttackButtonToBeInserted);
                    console.log('Inserted attack button to:', comboData.name, 'for game:', game.title);
                });

                const doesAttackButtonExistInCombo = db.prepare(`SELECT * FROM attack_button_character_combo WHERE character_combo_id = ? AND attack_button_id = ? AND order_in_combo = ?`).get(characterComboFromDB.id, attackButtonFromDB.id, inputData['order_in_combo']);
                if (doesAttackButtonExistInCombo) {
                    console.log(`Attack button '${attackButtonFromDB.name}' already exists in combo '${comboData.name}' for game:`, game.title);
                }
                else {
                    insertAttackButtonForCharacterComboTx(inputData);
                }

            }

            if(inputData.group === 'notations') {
                const gameNotationFromDB = db.prepare(`SELECT * FROM game_notations WHERE notation = ? AND game_id = ?`).get(inputData.notation, game.id);
                console.log('gameNotationFromDB:', gameNotationFromDB);
                if (!gameNotationFromDB) {
                    console.error('Game notation does not exist in DB.');
                    process.exit(1);
                }

                const insertCharacterComboGameNotationStatement = db.prepare(`INSERT INTO character_combo_game_notation (character_combo_id, game_notation_id, order_in_combo, created_at, updated_at) VALUES (@characterComboId, @gameNotationId, @orderInCombo, @createdAt, @updatedAt)`);
                const insertCharacterComboGameNotationTx = db.transaction((gameNotationData) => {
                    const characterComboGameNotationToBeInserted = {
                        characterComboId: characterComboFromDB.id,
                        gameNotationId: gameNotationFromDB.id,
                        orderInCombo: gameNotationData['order_in_combo'],
                        createdAt: now,
                        updatedAt: now,
                    }
                    // console.log('characterComboGameNotationToBeInserted:', characterComboGameNotationToBeInserted);

                    insertCharacterComboGameNotationStatement.run(characterComboGameNotationToBeInserted);
                    console.log('Inserted game notation to:', comboData.name, 'for game:', game.title);
                });

                const doesGameNotationExistInCombo = db.prepare(`SELECT * FROM character_combo_game_notation WHERE character_combo_id = ? AND game_notation_id = ? AND order_in_combo = ?`).get(characterComboFromDB.id, gameNotationFromDB.id, inputData['order_in_combo']);
                console.log('doesGameNotationExistInCombo:', doesGameNotationExistInCombo);
                if (doesGameNotationExistInCombo) {
                    console.log(`Game notation '${gameNotationFromDB.notation}' already exists in combo '${comboData.name}' for game:`, game.title);
                } else {
                    insertCharacterComboGameNotationTx(inputData);
                }
            }
        })
    })
}
