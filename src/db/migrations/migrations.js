// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './20241025154102_create_hit_zones_table.sql';
import m0001 from './20241025154135_create_games_table.sql';
import m0002 from './20241025154155_create_directional_inputs_table.sql';
import m0003 from './20241025154211_create_attack_buttons_table.sql';
import m0004 from './20241025154435_create_characters_table.sql';
import m0005 from './20241025154447_create_character_moves_table.sql';
import m0006 from './20241025154458_create_game_notations_table.sql';
import m0007 from './20241025154638_create_character_move_directional_input_pivot_table.sql';
import m0008 from './20241025154722_create_attack_button_character_move_pivot_table.sql';
import m0009 from './20241025154757_create_character_move_game_notation_pivot_table.sql';
import m0010 from './20241029144835_create_directional_input_game_notation_pivot_table.sql';
import m0011 from './20241030145418_create_attack_button_game_notation_pivot_table.sql';
import m0012 from './20241031144355_create_character_move_conditions_table.sql';
import m0013 from './20241031162356_create_character_move_character_move_condition_pivot_table.sql';
import m0014 from './20241101150822_create_character_move_follow_ups_pivot_table.sql';
import m0015 from './20241104153416_create_character_move_hit_zone_pivot_table.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006,
m0007,
m0008,
m0009,
m0010,
m0011,
m0012,
m0013,
m0014,
m0015
    }
  }
  