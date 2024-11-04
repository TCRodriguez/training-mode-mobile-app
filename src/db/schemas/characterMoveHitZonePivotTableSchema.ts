import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterMoves } from "./characterMovesTableSchema";
import { hitZones } from "./hitZonesSchema";

export const characterMoveHitZone = sqliteTable(
  'character_move_hit_zone',
  {
    characterMoveId: integer('character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    hitZoneId: integer('hit_zone_id', { mode: 'number' }).notNull().references(() => hitZones.id, { onDelete: 'cascade' }),
    orderInZoneList: integer('order_in_move').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_hit_zone_placement').on(table.characterMoveId, table.hitZoneId, table.orderInZoneList)
  })
);

