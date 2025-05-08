import dotenv from 'dotenv';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { checkIfDatabaseExists } from '../utils.mjs';
import { dbInit } from '../utils.mjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const seedMetadata = async () => {
  checkIfDatabaseExists();

  // TODO: Add `STATIC_GAME_DATA_VERSION` back in here when we switch to full typescript
  const metadataValues = [
    { key: 'static_game_data_version', value: '0.1.0' }
  ]

  try {
    const db = await dbInit();

    const insertMetadataStatement = db.prepare(`INSERT INTO metadata (key, value) VALUES (@key, @value)`);
    const insertMetadataTransaction = db.transaction((metadataValues) => {
      for (const metadataValue of metadataValues) {
        const metadataToBeInserted = {
          key: metadataValue.key,
          value: metadataValue.value,
        }

        const doesMetadataExist = db.prepare(`SELECT * FROM metadata WHERE key = ?`).get(metadataValue.key);
        if (doesMetadataExist) {
          console.log('Metadata already exists:', metadataValue.key);
          //TODO: Do we do another check here?

        } else {
          console.log('metadataToBeInserted:', metadataToBeInserted);
          insertMetadataStatement.run(metadataToBeInserted);
        }
      }
    });

    insertMetadataTransaction(metadataValues);
  } catch (error) {
    console.log(error);
  }

}
