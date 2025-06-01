import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterCombos } from "./characterCombosTableSchema";
import { directionalInputs } from "./directionalInputsSchema";
import { relations } from "drizzle-orm";

export const characterComboDirectionalInput = sqliteTable(
    'character_combo_directional_input',
    {
        characterComboId: integer('character_combo_id', { mode: 'number' }).notNull().references(() => characterCombos.id, { onDelete: 'cascade' }),
        directionalInputId: integer('directional_input_id', { mode: 'number' }).notNull().references(() => directionalInputs.id, { onDelete: 'cascade' }),
        orderInCombo: integer('order_in_combo').notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    },
    (table) => ({
        unq: unique('unique_character_combo_directional_input_order_set').on(table.characterComboId, table.directionalInputId, table.orderInCombo)
    })
);

export const characterComboDirectionalInputRelations = relations(characterComboDirectionalInput, ({ one }) => ({
    characterCombo: one(characterCombos, {
        fields: [characterComboDirectionalInput.characterComboId],
        references: [characterCombos.id]
    }),
    directionalInput: one(directionalInputs, {
        fields: [characterComboDirectionalInput.directionalInputId],
        references: [directionalInputs.id]
    }),
}));
