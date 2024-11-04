import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { directionalInputs } from "./directionalInputsSchema";
import { gameNotations } from "./gameNotationsTableSchema";

export const directionalInputGameNotation = sqliteTable(
  'directional_input_game_notation',
  {
    directionalInputId: integer('directional_input_id', { mode: 'number' }).notNull().references(() => directionalInputs.id, { onDelete: 'cascade' }),
    gameNotationId: integer('game_notation_id', { mode: 'number' }).notNull().references(() => gameNotations.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_directional_input_game_notation_set').on(table.directionalInputId, table.gameNotationId)
  })
);

