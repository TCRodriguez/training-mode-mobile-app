import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";
import { characters } from "./charactersTableSchema";

export const characterMoves = sqliteTable(
  'character_moves',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    resource_gain: integer('resource_gain'),
    resource_cost: integer('resource_cost'),
    meter_cost: integer('meter_cost'),
    meter_gain: integer('meter_gain'),
    hit_count: integer('hit_count'),
    ex_hit_count: integer('ex_hit_count'),
    damage: integer('damage'),
    category: text('category'),
    type: text('type'),
    startup_frames: integer('startup_frames'),
    active_frames: integer('active_frames'),
    recovery_frames: integer('recovery_frames'),
    frames_on_hit: integer('frames_on_hit'),
    frames_on_block: integer('frames_on_block'),
    frames_on_counter_hit: integer('frames_on_counter_hit'),
    move_list_number: integer('move_list_number'),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_in_game').on(table.name, table.characterId, table.gameId)
  })
);

