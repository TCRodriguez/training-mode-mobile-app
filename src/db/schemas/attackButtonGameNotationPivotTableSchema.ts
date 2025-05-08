import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { attackButtons } from "./attackButtonsTableSchema";
import { gameNotations } from "./gameNotationsTableSchema";

export const attackButtonGameNotation = sqliteTable(
  'attack_button_game_notation',
  {
    attackButtonId: integer('attack_button_id', { mode: 'number' }).notNull().references(() => attackButtons.id, { onDelete: 'cascade' }),
    gameNotationId: integer('game_notation_id', { mode: 'number' }).notNull().references(() => gameNotations.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_attack_button_game_notation_set').on(table.attackButtonId, table.gameNotationId)
  })
);

