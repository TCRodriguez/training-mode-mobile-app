import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";
import { characterMoves } from "./characterMovesTableSchema";
import { relations } from "drizzle-orm";
import { characterCombos } from "./characterCombosTableSchema";

export const characters = sqliteTable(
  'characters',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    archetype: text('archetype').notNull(),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
    updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_game_character_pair').on(table.name, table.gameId)
  })
);

export const characterRelations = relations(characters, ({ one, many }) => ({
  game: one(games, {
    fields: [characters.gameId],
    references: [games.id],
  }),
  characterMoves: many(characterMoves),
  characterCombos: many(characterCombos)
}));

