import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
// import { games } from "./gamesTableSchema";

export const characters = sqliteTable(
  'directional_inputs',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    direction: text('direction').notNull(),
    game_shorthand: text('game_shorthand'),
    numpad_notation: text('numpad_notation'),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
);

