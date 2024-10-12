// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './20240902234345_create_games_and_characters_table.sql';
import m0001 from './20240925045839_create_directional_inputs_table.sql';
import m0002 from './20241001010600_create_game_notations_table.sql';
import m0003 from './20241001045049_adjust_unique_constraint_for_game_notations_table.sql';
import m0004 from './20241006183344_create_attack_buttons_table.sql';
import m0005 from './20241006190927_create_hit_zones_table.sql';
import m0006 from './20241006204256_create_character_moves_table.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006
    }
  }
  