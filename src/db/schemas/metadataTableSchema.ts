import { text, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const metadata = sqliteTable(
  'metadata',
  {
    key: text('key').notNull(),
    value: text('value').notNull(),
  },
  (table) => ({
    unq: unique().on(table.key)
  })
);
