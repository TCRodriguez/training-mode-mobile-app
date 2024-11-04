import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { games } from "./gamesTableSchema";
import { characters } from "./charactersTableSchema";
import { characterMoves } from "./characterMovesTableSchema";

export const gameNotations = sqliteTable(
  'game_notations',
  {
    id: integer('id', { mode: 'number' }).primaryKey(),
    notation: text('notation').notNull(),
    description: text('description').notNull(),
    gameId: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
    characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }),
    characterMoveId: integer('character_move_id').references(() => characterMoves.id, { onDelete: 'cascade' }),
    notationsGroup: text('notations_group').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    unq: unique('unique_game_game_notations').on(table.notation, table.description, table.gameId, table.notationsGroup),
  })
);

