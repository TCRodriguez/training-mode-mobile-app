import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";

export const gameNotations = sqliteTable(
  'game_notations',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    notation: text('notation').notNull(),
    description: text('description').notNull(),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    notations_group: text('notations_group'),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_game_game_notations').on(table.notation, table.description, table.gameId)
  })
);

