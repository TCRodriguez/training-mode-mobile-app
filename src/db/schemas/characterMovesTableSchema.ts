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
    resourceGain: integer('resource_gain'),
    resourceCost: integer('resource_cost'),
    meterCost: integer('meter_cost'),
    meterGain: integer('meter_gain'),
    hitCount: integer('hit_count'),
    exHitCount: integer('ex_hit_count'),
    damage: integer('damage'),
    category: text('category'),
    type: text('type'),
    startupFrames: integer('startup_frames'),
    activeFrames: integer('active_frames'),
    recoveryFrames: integer('recovery_frames'),
    framesOnHit: integer('frames_on_hit'),
    framesOnBlock: integer('frames_on_block'),
    framesOnCounterHit: integer('frames_on_counter_hit'),
    moveListNumber: integer('move_list_number'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_in_game').on(table.name, table.characterId, table.gameId)
  })
);

