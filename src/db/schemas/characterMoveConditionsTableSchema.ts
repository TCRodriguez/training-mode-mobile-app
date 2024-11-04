import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";

export const characterMoveConditions = sqliteTable(
  'character_move_conditions',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    condition: text('condition').notNull(),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_conditions').on(table.condition, table.gameId)
  })
);

