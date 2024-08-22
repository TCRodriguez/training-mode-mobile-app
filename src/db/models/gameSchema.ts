import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";

const games = sqliteTable(
  'games',
  {
    id: integer('id'),
    title: text('title').notNull(),
    abbreviation: text('abbreviation').notNull(),
    buttons: text('buttons').notNull(),
    created_at: integer('created_at'),
    updated_at: integer('updated_at'),
  },
  (table) => ({
    unq: unique().on(table.title)
  })
);

integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true });
integer('created_at', { mode: 'timestamp' });
integer('updated_at', { mode: 'timestamp' });

export default games;

