import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterMoves } from "./characterMovesTableSchema";

export const characterMoveFollowUps = sqliteTable(
  'character_move_follow_ups',
  {
    characterMoveId: integer('character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    followUpCharacterMoveId: integer('follow_up_character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_follow_up').on(table.characterMoveId, table.followUpCharacterMoveId)
  })
);

