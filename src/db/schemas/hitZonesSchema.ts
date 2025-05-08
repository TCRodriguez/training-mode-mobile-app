import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const hitZones = sqliteTable(
  'hit_zones',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    zone: text('zone').notNull(),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_hit_zone').on(table.zone)
  })
);

