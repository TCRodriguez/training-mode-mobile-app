import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterCombos } from "./characterCombosTableSchema";
import { attackButtons } from "./attackButtonsTableSchema";
import { relations } from "drizzle-orm";

export const attackButtonCharacterCombo = sqliteTable(
    'attack_button_character_combo',
    {
        characterComboId: integer('character_combo_id', { mode: 'number' }).notNull().references(() => characterCombos.id, { onDelete: 'cascade' }),
        attackButtonId: integer('attack_button_id', { mode: 'number' }).notNull().references(() => attackButtons.id, { onDelete: 'cascade' }),
        orderInCombo: integer('order_in_combo').notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    },
    (table) => ({
        unq: unique('unique_attack_button_character_combo_order_set').on(table.attackButtonId, table.characterComboId, table.orderInCombo)
    })
);

export const attackButtonCharacterComboRelations = relations(attackButtonCharacterCombo, ({ one }) => ({
    attackButton: one(attackButtons, {
        fields: [attackButtonCharacterCombo.attackButtonId],
        references: [attackButtons.id]
    }),
    characterCombo: one(characterCombos, {
        fields: [attackButtonCharacterCombo.characterComboId],
        references: [characterCombos.id]
    }),
}))