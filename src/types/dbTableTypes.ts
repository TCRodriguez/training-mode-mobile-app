import { type InferSelectModel } from 'drizzle-orm';
import { games } from '../db/schemas/gamesTableSchema';
import { characters } from '../db/schemas/charactersTableSchema';
import { characterMoves } from '../db/schemas/characterMovesTableSchema';
import { gameNotations } from '../db/schemas/gameNotationsTableSchema';
import { changelog } from '../db/schemas/changelogTableSchema';


export type SelectGames = InferSelectModel<typeof games>;

export type SelectCharacters = InferSelectModel<typeof characters>;

export type SelectCharacterMoves = InferSelectModel<typeof characterMoves>;

export type SelectGameNotations = InferSelectModel<typeof gameNotations>;

export type SelectChangelog = InferSelectModel<typeof changelog>;
