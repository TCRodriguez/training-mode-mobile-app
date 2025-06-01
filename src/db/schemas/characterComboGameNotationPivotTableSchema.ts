import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { characterCombos } from "./characterCombosTableSchema";
import { gameNotations } from "./gameNotationsTableSchema";
import { relations } from "drizzle-orm";

export const characterComboGameNotation = sqliteTable(
    'character_combo_game_notation',
    {
        characterComboId: integer('character_combo_id', { mode: 'number' }).notNull().references(() => characterCombos.id, { onDelete: 'cascade' }),
        gameNotationId: integer('game_notation_id', { mode: 'number' }).notNull().references(() => gameNotations.id, { onDelete: 'cascade' }),
        orderInCombo: integer('order_in_combo').notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    },
    (table) => ({
        unq: unique('unique_character_combo_game_notation_order_set').on(table.characterComboId, table.gameNotationId, table.orderInCombo)
    })
);

export const characterComboGameNotationRelations = relations(characterComboGameNotation, ({ one }) => ({
    characterCombo: one(characterCombos, {
        fields: [characterComboGameNotation.characterComboId],
        references: [characterCombos.id]
    }),
    gameNotation: one(gameNotations, {
        fields: [characterComboGameNotation.gameNotationId],
        references: [gameNotations.id]
    }),
}));
