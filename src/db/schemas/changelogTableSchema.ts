import { text, integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const changelog = sqliteTable(
  'changelog',
  {
    id: integer('id').primaryKey(),
    uuid: text('uuid').notNull(),
    game: text('game').notNull(),
    description: text('description').notNull(),
    type: text('type'),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    processed_at: integer('processed_at', { mode: 'timestamp' }),
  },
  (table) => ({
    unq: unique().on(table.uuid)
  })
);
