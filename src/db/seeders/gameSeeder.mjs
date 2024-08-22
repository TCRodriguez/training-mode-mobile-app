// import sqlite3 from 'sqlite3';
import * as SQLite from 'expo-sqlite';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
import * as FileSystem from 'expo-file-system';


// sqlite3.verbose();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const seedGamesCLI = async (dbFilePath) => {
//   console.log('Seeding games...');
//   const jsonFilePath = path.join(__dirname, '../../../assets/data/gameData/Games.json');
//   console.log('jsonFilePath:', jsonFilePath);
//   //
//   // let gamesData: Array<{ title: string; abbreviation: string; buttons: string }>;
//   let gamesData;
//   // //
//   try {
//     const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
//     gamesData = JSON.parse(fileContent);
//   } catch (err) {
//     console.error('Error reading or parsing JSON file:', err.message);
//     return;
//   }
//
//   const db = new sqlite3.Database(dbFilePath, (err) => {
//     if (err) {
//       console.error('Error opening database:', err.message);
//       return;
//     } else {
//       console.log(`Connected to the database at: ${dbFilePath}`);
//     }
//
//
//
//     gamesData.forEach((game) => {
//       console.log('game:', game);
//       console.log('game.title:', game.title);
//       console.log('game.abbreviation:', game.abbreviation);
//       console.log('game.buttons:', game.buttons);
//
//       insertStmt.run(game.title, game.abbreviation, game.buttons, (err) => {
//         if (err) {
//           console.error('Error inserting data:', err.message);
//         } else {
//           console.log(`Inserted: ${game.title}`);
//         }
//       });
//     });
//
//     db.close((err) => {
//       if (err) {
//         console.error('Error closing database:', err.message);
//       } else {
//         console.log('Database connection closed.');
//       }
//     });
//   })
//
// }

export const seedGames = async (dbFilePath) => {
  const jsonFilePath = `${FileSystem.documentDirectory}assets/data/gameData/Games.json`;

  let gamesData;

  try {
    const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
    gamesData = JSON.parse(fileContent);
  } catch (err) {
    console.error('Error reading or parsing JSON file:', err.message);
    return;
  }

  const db = SQLite.openDatabaseSync(dbFilePath);

  const statement = await db.prepareAsync('INSERT INTO games (title, abbreviation, buttons) VALUES ($title, $abbreviation, $buttons)');

  try {
    for (const game of gamesData) {
      console.log('game:', game);
      console.log('game.title:', game.title);
      console.log('game.abbreviation:', game.abbreviation);
      console.log('game.buttons:', game.buttons);

      let result = await statement.executeAsync({ $title: game.title, $abbreviation: game.abbreviation, $buttons: game.buttons });
      console.log('result:', result);
    }
  } catch (error) {
    console.log('error:', error);
  } finally {
    await statement.finalizeAsync();
  }
}
