import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { games } from "./gamesTableSchema";
import { characters } from "./charactersTableSchema";
import { attackButtonCharacterCombo } from "./attackButtonCharacterComboPivotTableSchema";
import { characterComboDirectionalInput } from "./characterComboDirectionalInputPivotTableSchema";
import { characterComboGameNotation } from "./characterComboGameNotationPivotTableSchema";

export const characterCombos = sqliteTable(
    'character_combos',
    {
        id: integer('id').primaryKey(),
        name: text('name').notNull(),
        gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
        characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
        damage: integer('damage'),
        hits: integer('hits'),
        created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
        updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
    },
    (table) => ({
        unq: unique('unique_character_combo_name').on(table.name, table.characterId)
    })
);

export const characterComboRelations = relations(characterCombos, ({ one, many }) => ({
    game: one(games, {
        fields: [characterCombos.gameId],
        references: [games.id]
    }),
    character: one(characters, {
        fields: [characterCombos.characterId],
        references: [characters.id]
    }),
    attackButtons: many(attackButtonCharacterCombo),
    directionalInputs: many(characterComboDirectionalInput),
    gameNotations: many(characterComboGameNotation)

}));


