import {
  checkStaticGameDataVersionOnDevice,
  deviceStaticGameDataDBInit,
  createBackupOfDeviceDatabase,
  deviceDBInit,
} from './deviceDBHelpers';
import { STATIC_GAME_DATA_VERSION } from '../globalConstants';
import { extractUniqueConstraints } from './deviceDBHelpers';

import { games } from '../db/schemas/gamesTableSchema';
import { characters } from '../db/schemas/charactersTableSchema';
import { characterMoves } from '../db/schemas/characterMovesTableSchema';
import { gameNotations } from '../db/schemas/gameNotationsTableSchema';
import { changelog } from '../db/schemas/changelogTableSchema';
import { eq, sql } from 'drizzle-orm';
import {
  type SelectGames,
  type SelectCharacters,
  type SelectCharacterMoves,
  type SelectGameNotations,
  type SelectChangelog,
} from '../types/dbTableTypes';

export const updateStaticGameDataOnDevice = async () => {

  console.log(sql`PRAGMA index_list(game_notations);`);

  console.log('Inside updateStaticGameDataOnDevice function.');


  // Opens connection to the static game data database on the device
  const staticGameDataDB = await deviceStaticGameDataDBInit();
  if (!staticGameDataDB) {
    throw new Error('Error initializing static game data DB.');
  }
  // process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME;
  const deviceDB = await deviceDBInit();
  if (!deviceDB) {
    throw new Error('Error initializing device DB.');
  }

  let checkStaticGameDataDBChangelogTable: SelectChangelog[] = [];
  let deviceDBChangelogRecords: SelectChangelog[] = [];
  let now = new Date().toISOString();


  // const gamesonDeviceDB = await deviceDB?.select().from(games);
  // console.log('Games table from device DB:', gamesonDeviceDB);



  checkStaticGameDataDBChangelogTable = await staticGameDataDB.select().from(changelog);
  console.log('Changelog table from static game data DB:', checkStaticGameDataDBChangelogTable);


  try {
    deviceDBChangelogRecords = (await deviceDB?.select().from(changelog)) ?? [];
    console.log('Changelog table from device DB:', deviceDBChangelogRecords);

  } catch (error) {
    console.error('Error fetching changelog table from device DB:', error);
  }







  checkStaticGameDataDBChangelogTable?.forEach(async (changelogRow) => {
    console.log('changelogRow:', changelogRow);
    // console.log('uuid:', changelogRow.uuid);

    const doesChangelogRecordExistInDeviceDB = deviceDBChangelogRecords?.find((record) => record.uuid === changelogRow.uuid);
    if (!doesChangelogRecordExistInDeviceDB) {
      let gameDataFromStaticDB: SelectGames[] = [];
      let gameDataFromDeviceDB: SelectGames[] = [];
      let charactersDataFromStaticGameDataDB: SelectCharacters[] = [];
      let charactersDataFromDeviceDB: SelectCharacters[] = [];
      let characterMovesDataFromStaticGameDataDB: SelectCharacterMoves[] = [];
      let characterMovesDataFromDeviceDB: SelectCharacterMoves[] = [];
      let gameNotationsDataFromStaticGameDataDB: SelectGameNotations[] = [];
      let gameNotationsDataFromDeviceDB: SelectGameNotations[] = [];

      // `games` table data
      gameDataFromStaticDB = await staticGameDataDB?.select().from(games).where(eq(games.title, changelogRow.game));
      // console.log('Games table from static game data DB:', gameDataFromStaticDB);
      const gameIdFromStaticDB = gameDataFromStaticDB?.[0]?.id;
      // console.log('Game ID from static game data DB:', gameIdFromStaticDB);
      gameDataFromDeviceDB = await deviceDB?.select().from(games).where(eq(games.title, changelogRow.game));
      // console.log('Games table from device DB:', gameDataFromDeviceDB);
      const gameIdFromDeviceDB = gameDataFromDeviceDB?.[0]?.id;
      // console.log('Game ID from device DB:', gameIdFromDeviceDB);

      // `characters` table data
      // const charactersDataFromStaticGameDataDB = await staticGameDataDB?.select().from(characters).where(eq(characters.gameId, gameIdFromStaticDB!));
      // console.log('Characters table from static game data DB:', charactersDataFromStaticGameDataDB);
      // const charactersDataFromDeviceDB = await deviceDB?.select().from(characters).where(eq(characters.gameId, gameIdFromDeviceDB!));
      // console.log('Characters table from device DB:', charactersDataFromDeviceDB);
      //

      // `characterMoves` table data
      // const characterMovesDataFromStaticGameDataDB = await staticGameDataDB?.select().from(characterMoves).where(eq(characterMoves.gameId, gameIdFromStaticDB!));
      // console.log('Character moves table from static game data DB:', characterMovesDataFromStaticGameDataDB);
      // const characterMovesDataFromDeviceDB = await deviceDB?.select().from(characterMoves).where(eq(characterMoves.gameId, gameIdFromDeviceDB!));
      // console.log('Character moves table from device DB:', characterMovesDataFromDeviceDB);

      // `gameNotations` table data
      gameNotationsDataFromStaticGameDataDB = await staticGameDataDB?.select().from(gameNotations).where(eq(gameNotations.gameId, gameIdFromStaticDB!));
      // console.log('Game notations table from static game data DB:', gameNotationsDataFromStaticGameDataDB);
      gameNotationsDataFromDeviceDB = await deviceDB?.select().from(gameNotations).where(eq(gameNotations.gameId, gameIdFromDeviceDB!));
      // console.log('Game notations table from device DB:', gameNotationsDataFromDeviceDB);


      // TODO: Insert the record into the device DB changelog table, and then update the static game data on the device.
      // TODO: Do this within an TRANSACTION block, so that if the update fails, the changelog record is not inserted.

      console.log('Update will happen.');



      // TODO: How do we update the static game data DB with newly updated JSON data?
      // TODO: Changing anything that is "parent" information -- like a game title -- will require updating all areas that reference that parent information throughout the JSON files.
      // TODO: If we don't, then the seeders will fail, since they're looking for the specified parent information -- but this is a different issue than the one we're trying to solve here.

      try {
        await deviceDB?.transaction(async (tx) => {
          for (const gameNotation of gameNotationsDataFromStaticGameDataDB) {
            // expoDb = openDatabaseSync(`${process.env.EXPO_PUBLIC_DEVICE_STATIC_GAME_DATA_DATABASE_NAME}.db`); // Ensure the name matches your copied file
            // process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME;
            // Will it work if we instead use the `expo-sqlite` db instance instead of the drizzle ORM one?
            // That way we can execute raw SQL queries, which would enable us to use that `COALESCE` function to address the `character_id` issue?

            // const testStatement = sql`select * from game_notations where character_id = ${gameNotation.characterId}`;
            // const testStatementResponse: unknown[] = deviceDB?.all(testStatement);
            // console.log('testStatementResponse:', testStatementResponse);
            // Didn't work
            // We may need to just update the unique constraints on the `game_notations` table to not include the `character_id` field
            // Need to remember to add the notation to training_mode_local_dev!
            // Do this by running the seeder




            await tx
              .insert(gameNotations)
              .values({
                notation: gameNotation.notation,
                description: gameNotation.description,
                gameId: gameNotation.gameId,
                characterId: gameNotation.characterId ?? null,  // ✅ Prevents undefined issues
                notationsGroup: gameNotation.notationsGroup,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: [
                  gameNotations.notation,
                  gameNotations.description,
                  gameNotations.gameId,
                  gameNotations.characterId,
                  gameNotations.notationsGroup,
                ],
                set: {
                  description: gameNotation.description,
                  characterId: sql`COALESCE(NULLIF(game_notations.character_id, ''), ${gameNotation.characterId})`,  // ✅ Preserves existing values correctly
                  notationsGroup: gameNotation.notationsGroup,
                  updatedAt: new Date(),
                },
              });
          }

          // Add change log record to device DB
          await tx.insert(changelog).values({
            uuid: changelogRow.uuid,
            game: changelogRow.game,
            description: changelogRow.description,
            created_at: new Date(),
            processed_at: new Date(),
          }).onConflictDoNothing({
            target: [changelog.uuid],
          });
        });
      } catch (error) {

        console.log('Error updating static game data on deviceDB:', error);
      }


    } else {
      console.log(`Changelog record with UUID ${changelogRow.uuid} exists in device DB.`);
      console.log('No update will happen.');
    }


  });


  // TODO: Do we do the checking of the static game data here? Outside of the forEach loop above?


  return;


  // If the versions are the same, do nothing
  // If the device db file does not exist, do nothing


}

