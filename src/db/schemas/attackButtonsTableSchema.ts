import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";

export const attackButtons = sqliteTable(
  'attack_buttons',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    gameShorthand: text('game_shorthand'),
    buttonCount: text('button_count'),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_game_attack_buttons').on(table.name, table.gameShorthand, table.gameId)
  })
);

