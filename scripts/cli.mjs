#!/usr/bin/env node

import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { runMigrations } from './cli_modules/runMigrationsCLI.mjs';
import { createDatabase } from './cli_modules/createDatabase.mjs';
import { seedDatabase } from './cli_modules/seedDatabase.mjs';
import { deleteDatabase } from './cli_modules/deleteDatabase.mjs';
import { deleteResource } from './cli_modules/data_model_actions/deleteResource.mjs';
import { dbInit, updateMetadata } from './cli_modules/utils.mjs';


sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const DATABASE_NAME = process.env.EXPO_PUBLIC_DEV_DATABASE_NAME;
const DATABASE_DIRECTORY_PATH = process.env.EXPO_PUBLIC_DEV_DATABASE_DIRECTORY_PATH;

const deleteDeviceDatabase = async (dbName) => {
  const dbDirectoryPath = `/Users/tonatiuhrodriguez/Library/Developer/CoreSimulator/Devices/5159F7D9-1881-4D1D-BC54-B942C3FBFAB7/data/Containers/Data/Application/4807872D-5DA9-4804-B031-BF1FA9163E29/Documents/SQLite`;
  const dbFilePath = path.join(dbDirectoryPath, `${dbName}.db`);
  console.log(dbName);
  console.log('dbFilePath:', dbFilePath);

  if (fs.existsSync(dbFilePath)) {
    console.log(`Database file exists at: ${dbFilePath}`);

    const answer = await confirm({ message: `Are you sure you want to delete the database file at: ${dbFilePath}?` });

    if (answer === true) {
      try {
        fs.unlinkSync(dbFilePath);
        console.log(`Database file ${dbFilePath} deleted successfully.`);
      } catch (error) {
        console.error('Error deleting the database:', error);
      }
    } else {
      console.log('Database deletion cancelled.');
    }
  } else {
    console.log(`Database file ${dbFilePath} does not exist.`);
  }
};

// Function to generate MST model based on table schema
const generateMSTModel = (dbName, tableName) => {
  // console.log(tableName);
  // const dbDirectoryPath = `/Users/tonatiuhrodriguez/Library/Developer/CoreSimulator/Devices/5159F7D9-1881-4D1D-BC54-B942C3FBFAB7/data/Containers/Data/Application/4807872D-5DA9-4804-B031-BF1FA9163E29/Documents/SQLite`;
  // const dbFilePath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}.db`;
  const dbFilePath = `${DATABASE_DIRECTORY_PATH}/${DATABASE_NAME}.db`;
  // console.log(dbFilePath);
  // const dbFilePath = path.join(dbDirectoryPath, `${dbName}.db`);

  if (fs.existsSync(dbFilePath)) {
    try {
      const db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Connected to the ${DATABASE_NAME} database.`);
          // Query the table schema
          const statement = `PRAGMA table_info(${tableName});`;
          db.all(statement, (err, rows) => {
            if (err) {
              console.error('Error retrieving schema:', err.message);
            } else {
              // console.log(`Schema for table ${tableName}:`);
              // console.log(rows);
              // Generate MST model file based on the schema
              generateModelFile(tableName, rows);
            }
          });
        }
      });

      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Closed the database connection.');
      });
    } catch (error) {
      console.error('Error generating MST model:', error);
    }
  } else {
    console.log(`Database file ${dbFilePath} does not exist.`);
  }
};

const generateModelFile = (tableName, schema) => {
  console.log('tableName:', tableName);
  const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1); // Capitalize the first letter
  console.log('modelName:', modelName);
  const fields = schema.map(column => {
    const fieldType = mapSQLiteTypeToMSTType(column.type);
    return `${column.name}: types.${fieldType}${column.pk ? '.identifier' : ''}`;
  }).join(',\n  ');

  const modelTemplate = `
    import { types } from 'mobx-state-tree';

    const ${modelName} = types.model('${modelName}', {
      ${fields}
    });

    export default ${modelName};
    `;

  console.log(modelTemplate);
  // const filePath = path.join(__dirname, `../models/${modelName}.js`);
  // fs.writeFileSync(filePath, modelTemplate);
  // console.log(`MST model for table "${tableName}" generated successfully at: ${filePath}`);
};

// Helper function to map SQLite types to MST types
const mapSQLiteTypeToMSTType = (sqliteType) => {
  switch (sqliteType.toLowerCase()) {
    case 'integer':
      return 'integer';
    case 'text':
      return 'string';
    case 'real':
      return 'number';
    case 'blob':
      return 'frozen'; // Can be used for any type of data
    default:
      return 'string'; // Fallback to string
  }
};






// Function to list all tables in the database
const listTables = async (dbName) => {
  let db;
  if (dbName === 'default') {
    console.error('Error: Please provide a database name as the first argument.');
    process.exit(1);
  }
  try {
    db = await dbInit(dbName);

    const statement = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    console.log('Tables in the database:');
    statement.forEach((table) => {
      console.log(table.name);
    });
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
};




// CLI Commands
const commands = {
  'db:nuke-device-db': {
    description: 'Deletes the database file from the device.',
    parameters: ['dbName'],
    action: async (dbName) => {
      deleteDeviceDatabase(dbName);
    },
  },

  'db:nuke-local-db': {
    description: 'Deletes the database file from the local directory.',
    parameters: ['dbName'],
    action: async (dbName) => {
      deleteDatabase(dbName);
    },
  },
  'db:migrate': {
    description: 'Runs database migrations.',
    parameters: ['dbName'],
    action: async (dbName) => {
      runMigrations(dbName);
    },
  },
  'db:migrate-fresh': {
    description: 'Deletes database file, creates new database, and runs migrations.',
    parameters: ['dbName'],
    action: async (dbName) => {
      await deleteDatabase(dbName);
      await createDatabase();
      await runMigrations(dbName);
    },
  },
  'db:create': {
    description: 'Creates a new database.',
    parameters: [],
    action: async () => {
      createDatabase();
    },
  },
  'db:seed': {
    description: 'Seeds the database with initial data.',
    parameters: ['seeder'],
    action: async (seeder) => {
      seedDatabase(seeder);
    },
  },
  'db:tables': {
    description: 'Lists all tables in the database.',
    parameters: ['dbName'],
    action: (dbName) => {
      listTables(dbName);
    },
  },
  'generate:model': {
    description: 'Generates a model for a specific table.',
    parameters: ['dbName', 'tableName'],
    action: (dbName, tableName) => {
      generateMSTModel(dbName, tableName);
    },
  },
  'resource:delete': {
    description: 'Deletes a resource from the database.',
    parameters: ['resourceName', 'resourceId'],
    action: async (resourceName, resourceId) => {
      await deleteResource(resourceName, resourceId);
    },
  },
  //TODO: Add commandn to update metadata value
  // 'metadata:update': {
  //   description: 'Updates a metadata value in the database.',
  //   parameters: ['key', 'value'],
  //   action: async (key, value) => {
  //     await updateMetadata(key, value);
  //   },
  // },
  'cli:commands': {
    description: 'Lists all available CLI commands along with their descriptions and parameters.',
    parameters: [],
    action: () => {
      console.log('====================================');
      console.log('Available commands:');
      Object.entries(commands).forEach(([command, { description, parameters }]) => {
        const params = parameters.length ? ` <${parameters.join('> <')}>` : '';
        console.log('-------------------');
        console.log(`${command}${params}: ${description}`);
      });
      console.log('====================================');
    },
  },
};

// Run the CLI
const run = () => {
  const [, , command, ...args] = process.argv;

  if (commands[command]) {
    commands[command].action(...args);
  } else {
    console.log(`Unknown command: ${command}`);
    commands['cli:commands'].action();
  }
};

run();

