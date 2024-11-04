import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterMoves } from "./characterMovesTableSchema";
import { gameNotations } from "./gameNotationsTableSchema";

export const characterMoveGameNotation = sqliteTable(
  'character_move_game_notation',
  {
    characterMoveId: integer('character_move_id', { mode: 'number' }).notNull().references(() => characterMoves.id, { onDelete: 'cascade' }),
    gameNotationId: integer('game_notation_id', { mode: 'number' }).notNull().references(() => gameNotations.id, { onDelete: 'cascade' }),
    orderInMove: integer('order_in_move').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_character_move_game_notation_order_set').on(table.characterMoveId, table.gameNotationId, table.orderInMove)
  })
);

