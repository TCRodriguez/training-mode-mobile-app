#!/usr/bin/env node

import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { seedGamesCLI } from '../src/db/seeders/gameSeeder.mjs';

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteDatabase = async (dbName) => {
  const dbDirectoryPath = `/Users/tonatiuhrodriguez/Library/Developer/CoreSimulator/Devices/5159F7D9-1881-4D1D-BC54-B942C3FBFAB7/data/Containers/Data/Application/5CF66A98-1B72-40AB-858F-DFF281FA0BAD/Documents/SQLite`;
  const dbFilePath = path.join(dbDirectoryPath, `${dbName}.db`);

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
    console.log('Database file does not exist.');
  }
};

// Function to create a new SQLite database and run migrations
const reinitializeDatabase = (dbName) => {
  const dbFilePath = path.join(__dirname, `../SQLite/${dbName}.db`);

  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Connected to the ${dbName} database.`);
      runMigrations(db);
    }
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
};

// Function to run migrations
const runMigrations = (db) => {
  console.log('Running migrations...');

  db.serialize(() => {
    // Example migration: Create a "games" table
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      publisher TEXT
    );`, (err) => {
      if (err) {
        console.error('Error running migration:', err.message);
      } else {
        console.log('Migration completed: games table created.');
      }
    });

    // You can add more migrations here as needed
  });
};

const runSeeders = async (dbName) => {
  const dbDirectoryPath = `/Users/tonatiuhrodriguez/Library/Developer/CoreSimulator/Devices/5159F7D9-1881-4D1D-BC54-B942C3FBFAB7/data/Containers/Data/Application/5CF66A98-1B72-40AB-858F-DFF281FA0BAD/Documents/SQLite`;
  const dbFilePath = path.join(dbDirectoryPath, `${dbName}.db`);



  if (fs.existsSync(dbFilePath)) {
    const answer = await confirm({ message: `Are you sure you want to run all seeders?` });

    if (answer === true) {
      try {
        seedGamesCLI(dbFilePath);
        console.log('Database seeded successfully.');
      } catch (error) {
        console.error('Error seeding the database:', error);
      }
    } else {
      console.log('Database seeding cancelled.');
    }
  } else {
    console.log('Database file does not exist.');
  }
}

// CLI Commands
const commands = {
  'db:nuke': (dbName) => {
    deleteDatabase(dbName);
    // reinitializeDatabase(dbName);
  },
  'db:migrate': (dbName) => {
    // reinitializeDatabase(dbName);
    console.log(`Migrating database: ${dbName}`);
  },
  'db:seed': (dbName) => {
    runSeeders(dbName);
    // console.log(`Seeding database: ${dbName}`);
    // Add your seeding logic here
  },
};

// Run the CLI
const run = () => {
  const [, , command, dbName = 'default'] = process.argv;

  if (commands[command]) {
    commands[command](dbName);
  } else {
    console.log(`Unknown command: ${command}`);
    console.log('Available commands:');
    console.log(Object.keys(commands).join('\n'));
  }
};

run();

