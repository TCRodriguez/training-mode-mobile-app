import { openDatabaseSync } from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';
// import gamesDataJSON from '../../../data/gameData';
import { DATABASE_NAME } from '@env';
import { importJSONFilesFromDirectory } from '../../helpers/recursiveJSONImporter';

export const seedCharacters = async () => {
  try {
    console.log('Seeding characters...');
    const charactersDataJSON = await importJSONFilesFromDirectory('../../../data/gameData');

    console.log('charactersDataJSON:', charactersDataJSON);

  } catch (error) {
    console.error('Error seeding characters:', error);
  }






  console.log('Seeding characters complete.');




  return;
  let db;

  try {
    db = openDatabaseSync(`${DATABASE_NAME}.db`);
  } catch (error) {
    console.error('Error opening database:', error);
    return;
  }

  try {
    const now = new Date().toISOString();
    const statement = await db.prepareAsync('INSERT INTO games (title, abbreviation, buttons, created_at, updated_at) VALUES ($title, $abbreviation, $buttons, $createdAt, $updatedAt)');

    const gamesTableData = await db.getAllAsync('SELECT * FROM games');
    const gameTitles = gamesTableData.map((game) => game.title);
    console.log('gameTitles:', gameTitles);


    for (const game of gamesDataJSON) {
      if (gameTitles.includes(game.title)) {
        console.log('A game with that title already exists:', game.title);
      } else {
        let result = await statement.executeAsync({ $title: game.title, $abbreviation: game.abbreviation, $buttons: game.buttons, $createdAt: now, $updatedAt: now });
        console.log('result:', result);
      }
    }
  } catch (error) {
    console.log('error:', error);
  } finally {
    await statement.finalizeAsync();
  }
}
