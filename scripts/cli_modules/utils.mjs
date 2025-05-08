import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const DATABASE_NAME = process.env.EXPO_PUBLIC_DEV_DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.EXPO_PUBLIC_DEV_DATABASE_DIRECTORY_PATH;

export const checkIfDatabaseExists = () => {
  if (fs.existsSync(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`)) {
    console.log(`Database file exists at: ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
  } else {
    console.log(`Database file ${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db does not exist. Please create the DB file first.`);
    process.exit(1);
  }
}

export const dbInit = async () => {
  checkIfDatabaseExists();

  try {
    const db = new Database(`${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`);
    db.pragma('foreign_keys = ON');

    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    process.exit(1);
  }
}

// TODO: Flagging to potentially remove this function
// export const checkIfResourceExists = async (table, column, foreignKeys) => {
//   const db = await dbInit();
//   const doesResourceExist = db.prepare(`SELECT * FROM ${table} WHERE ${column} = ?`).get();
//
//   if (doesResourceExist) {
//     console.log(`${column} resouce already exists:`, column);
//   } else {
//     console.log('hitZoneToBeInserted:', hitZoneToBeInserted);
//     insertHitZonesStatement.run(hitZoneToBeInserted);
//   }
//
//   return doesResourceExist;
// }

// export const updateMetadata = async (key, value) => {
//   const isValidVersionFormat = (value) => {
//     // The regex checks for three groups of digits separated by dots
//     const versionRegex = /^\d+\.\d+\.\d+$/;
//     return versionRegex.test(value);
//   };

//   if (key === 'static_game_data_version') {
//     // Validate the version format
//     if (!isValidVersionFormat(value)) {
//       console.log('Invalid version format:', value);
//       console.log('Please use the following format: x.x.x');

//       return;
//     }
//   }

//   const db = await dbInit();

//   const metadataToUpdate = { 'key': key, 'value': value };
//   console.log('metadataToUpdate:', metadataToUpdate);
//   // return;

//   const metadataFromDB = db.prepare(`SELECT * FROM metadata WHERE key = ?`).get(metadataToUpdate.key);
//   if (!metadataFromDB) {
//     console.log('Metadata does not exist:', metadataToUpdate.key);
//     return;
//   }

//   if (metadataFromDB.value === metadataToUpdate.value) {
//     console.log(`${metadataToUpdate.key} is already set to:`, metadataToUpdate.value);
//     return;
//   }

//   const updateMetadataStatement = db.prepare(`UPDATE metadata SET value = ? WHERE key = ?`);
//   const handleUpdate = async (metadata) => {

//     // TODO: Putting this here to double check that the value in the globalConstants.ts file has been updated.
//     // Can remove once we can import the globalConstants.ts file properly
//     const doubleCheckAnswer = await confirm({ message: `Did you check/update the value in the globalConstants.ts file already?` });
//     if (doubleCheckAnswer === false) {
//       console.log('Please update the value in the globalConstants.ts file first.');
//       return;
//     }

//     const answer = await confirm({ message: `Are you sure you want to update the ${metadata.key} value from ${metadataFromDB.value} to ${metadata.value}?` });

//     if (answer === true) {
//       try {
//         const updateMetadataTransaction = db.transaction((metadata) => {
//           const info = updateMetadataStatement.run(metadata.value, metadata.key);
//           console.log('Metadata updated:', info);
//         });

//         updateMetadataTransaction(metadata);
//       } catch (error) {
//         console.error('Error updating metadata:', error);
//       }
//     } else {
//       console.log('Metadata update cancelled.');
//     }
//   }

//   await handleUpdate(metadataToUpdate);
// }

