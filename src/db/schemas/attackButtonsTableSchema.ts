import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";

export const attackButtons = sqliteTable(
  'attack_buttons',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    game_shorthand: text('game_shorthand'),
    button_count: text('button_count'),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_game_attack_buttons').on(table.name, table.game_shorthand, table.gameId)
  })
);

