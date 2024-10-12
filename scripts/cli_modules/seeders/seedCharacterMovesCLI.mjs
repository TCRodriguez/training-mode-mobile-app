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

  try {
    const jsonFiles = await traverseDirectoryAndGetFiles('assets/data/gameData', [], 'characters');
    const characterData = await readJsonFiles(jsonFiles);

    // console.log('characterData:', characterData);
    // console.log('characterData:', util.inspect(characterData, { depth: null, colors: true }))
    // return;



    const now = new Date().toISOString();

    try {
      const db = await dbInit();

      const selectGameStatement = db.prepare(`SELECT * FROM games WHERE title = ?`);
      const selectCharacterStatement = db.prepare(`SELECT * FROM characters WHERE name = ? AND game_id = ?`);


      const insertCharacterMoveStatement = db.prepare(`INSERT INTO character_moves (name, character_id, game_id, resource_gain, resource_cost, meter_cost, meter_gain, hit_count, ex_hit_count, damage, category, type, startup_frames, active_frames, recovery_frames, frames_on_hit, frames_on_block, frames_on_counter_hit, move_list_number, created_at, updated_at) VALUES (@name, @character_id, @game_id, @resource_gain, @resource_cost, @meter_cost, @meter_gain, @hit_count, @ex_hit_count, @damage, @category, @type, @startup_frames, @active_frames, @recovery_frames, @frames_on_hit, @frames_on_block, @frames_on_counter_hit, @move_list_number, @created_at, @updated_at)`);
      const insertCharacterMovesTx = db.transaction((characters) => {
        for (const character of characters) {
          if (character[0].moves.length === 1) {
            console.log('No moves found in JSON file for:', character[0].name);
            continue;
          }

          const gameFromDB = selectGameStatement.get(character[0].game);
          const characterFromDB = selectCharacterStatement.get(character[0].name, gameFromDB.id);
          console.log('game:', gameFromDB);
          console.log('characterFromDB:', characterFromDB);
          console.log('-----------------------');
          for (const characterMove of character[0].moves) {


            if (!gameFromDB) {
              console.log('Game not found:', character[0].game);
              process.exit(1);
            } else {
              if (!characterFromDB) {
                console.log('Character not found:', character[0].name);
                process.exit(1);
              } else {

                const characterMoveToBeInserted = {
                  name: characterMove.name,
                  character_id: characterFromDB.id,
                  game_id: gameFromDB.id,
                  resource_gain: characterMove.resource_gain,
                  resource_cost: characterMove.resource_cost,
                  meter_cost: characterMove.meter_cost,
                  meter_gain: characterMove.meter_gain,
                  hit_count: characterMove.hit_count,
                  ex_hit_count: characterMove.ex_hit_count,
                  damage: characterMove.damage,
                  category: characterMove.category,
                  type: characterMove.type,
                  startup_frames: characterMove.startup_frames,
                  active_frames: characterMove.active_frames,
                  recovery_frames: characterMove.recovery_frames,
                  frames_on_hit: characterMove.frames_on_hit,
                  frames_on_block: characterMove.frames_on_block,
                  frames_on_counter_hit: characterMove.frames_on_counter_hit,
                  move_list_number: characterMove.move_list_number,
                  created_at: now,
                  updated_at: now,
                }

                const doesCharacterMoveExist = db.prepare(`SELECT * FROM character_moves WHERE name = ? AND character_id = ? AND game_id = ?`).get(characterMove.name, characterFromDB.id, gameFromDB.id);
                if (doesCharacterMoveExist) {
                  console.log('Character move already exists:', characterMove.name);
                } else {
                  console.log('characterMoveToBeInserted:', characterMoveToBeInserted);
                  insertCharacterMoveStatement.run(characterMoveToBeInserted);

                }

                // TODO: YOU LEFT OFF HERE.
                // TODO: Keep parsing through characterMove data.

              }
            }
          }
        }
      });

      insertCharacterMovesTx(characterData);
    } catch (error) {
      console.error('Error opening database:', error);
      return;
    }



  } catch (error) {
    console.error('Error opening database:', error);
    return;
  }






}
