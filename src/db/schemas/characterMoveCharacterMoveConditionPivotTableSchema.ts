import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterMoves } from "./characterMovesTableSchema";
import { characterMoveConditions } from "./characterMoveConditionsTableSchema";

export const characterMoveCharacterMoveCondition = sqliteTable(
  'character_move_character_move_condition',
  {
    characterMoveId: integer('character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    characterMoveConditionId: integer('character_move_condition_id', { mode: 'number' }).notNull().references(() => characterMoveConditions.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_character_move_condition_set').on(table.characterMoveId, table.characterMoveConditionId)
  })
);

