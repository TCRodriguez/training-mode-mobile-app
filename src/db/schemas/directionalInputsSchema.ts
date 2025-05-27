import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { characterMoveDirectionalInput } from "./characterMoveDirectionalInputPivotTableSchema";

export const directionalInputs = sqliteTable(
  'directional_inputs',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    direction: text('direction').notNull(),
    gameShorthand: text('game_shorthand'),
    numpadNotation: text('numpad_notation'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_directional_inputs').on(table.direction)
  })
);

export const directionalInputRelations = relations(directionalInputs, ({ many }) => ({
  characterMoveDirectionalInput: many(characterMoveDirectionalInput)
}))
