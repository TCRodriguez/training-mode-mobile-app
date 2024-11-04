import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterMoves } from "./characterMovesTableSchema";
import { directionalInputs } from "./directionalInputsSchema";

export const characterMoveDirectionalInput = sqliteTable(
  'character_move_directional_input',
  {
    // TODO: How can make this `bigint unsigned`?
    characterMoveId: integer('character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    directionalInputId: integer('directional_input_id', { mode: 'number' }).notNull().references(() => directionalInputs.id, { onDelete: 'cascade' }),
    orderInMove: integer('order_in_move').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('character_move_directional_input_order_set').on(table.characterMoveId, table.directionalInputId, table.orderInMove)
  })
);
