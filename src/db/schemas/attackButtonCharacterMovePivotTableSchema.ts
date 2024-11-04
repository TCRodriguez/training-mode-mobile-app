import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterMoves } from "./characterMovesTableSchema";
import { attackButtons } from "./attackButtonsTableSchema";

export const attackButtonCharacterMove = sqliteTable(
  'attack_button_character_move',
  {
    attackButtonId: integer('attack_button_id', { mode: 'number' }).notNull().references(() => attackButtons.id, { onDelete: 'cascade' }),
    characterMoveId: integer('character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    orderInMove: integer('order_in_move').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_attack_button_character_move_order_set').on(table.attackButtonId, table.characterMoveId, table.orderInMove)
  })
);

