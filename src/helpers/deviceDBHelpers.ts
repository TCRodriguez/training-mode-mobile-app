import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { STATIC_GAME_DATA_VERSION, MAX_DATABASE_BACKUPS } from '../globalConstants';
import { metadata } from '../db/schemas/metadataTableSchema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { openDatabaseSync } from 'expo-sqlite/next';

const localDevDbName = process.env.EXPO_PUBLIC_LOCAL_DEV_DATABASE_NAME;
const deviceDBName = process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME;
const deviceStaticGameDataDBName = process.env.EXPO_PUBLIC_DEVICE_STATIC_GAME_DATA_DATABASE_NAME;
const deviceDbAssetPath = `${FileSystem.documentDirectory}SQLite/${deviceDBName}.db`;
const deviceStaticGameDataDbAssetPath = `${FileSystem.documentDirectory}SQLite/${deviceStaticGameDataDBName}.db`;

export const checkIfDeviceDatabaseFileExists = async () => {
  // return;
  const dbFile = await FileSystem.getInfoAsync(deviceDbAssetPath);
  console.log('Checking if device database file exists:', dbFile.exists);

  if (!dbFile.exists) {
    return false;
  } else {
    return true;
  }
}

// TODO: Consider removing this since the static game data file will always be bundled with the app
// TODO: Thus, there shouldn't be a need to check if it exists on the device
export const checkIfStaticGameDataDatabaseFileExists = async () => {
  const dbFile = await FileSystem.getInfoAsync(deviceStaticGameDataDbAssetPath);
  console.log('Checking if static game data database file exists:', dbFile.exists);

  if (!dbFile.exists) {
    return false;
  } else {
    return true;
  }
}


export const deviceDBInit = async () => {
  // return;
  let expoDb;
  let db;

  const doesDBFileExists = await checkIfDeviceDatabaseFileExists();

  if (!doesDBFileExists) {
    console.log('Device database file does not exist. Make sure it is copied from the assets folder.');
    return null;
  } else {
    console.log('Device database file exists, opening connection...');
    expoDb = openDatabaseSync(`${deviceDBName}.db`); // Ensure the name matches your copied file
    db = drizzle(expoDb);

    // TODO: Turn foreign key constraints on through PRAGMA here?

    return db;
  }
}

export const deviceStaticGameDataDBInit = async () => {
  let expoDb;
  let db;
  let staticGameDataDBFile;

  try {
    // Open the database connection to file in assets folder
    staticGameDataDBFile = Asset.fromModule(require('../../assets/training_mode_local_dev.db'));
    await staticGameDataDBFile.downloadAsync();

    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });
    // Copies to static game data file to device to make it accessible
    await FileSystem.copyAsync({
      from: staticGameDataDBFile?.localUri!,
      to: deviceStaticGameDataDbAssetPath,
    });

    console.log('Static game data database file name:', staticGameDataDBFile?.name);

    expoDb = openDatabaseSync(`${process.env.EXPO_PUBLIC_DEVICE_STATIC_GAME_DATA_DATABASE_NAME}.db`); // Ensure the name matches your copied file
    db = drizzle(expoDb);

    return db;
  } catch (error) {
    console.log('Error downloading static game data database file:', error);
  }
}

export const printDirectoryContents = async (directoryPath: string) => {
  // return;
  try {
    // Check if the directory exists
    const dirInfo = await FileSystem.getInfoAsync(directoryPath);
    if (dirInfo.exists) {
      // Read the contents of the directory
      const contents = await FileSystem.readDirectoryAsync(directoryPath);
      console.log(`Contents of ${directoryPath}: `, contents);
    } else {
      console.log(`Directory ${directoryPath} does not exist.`);
    }
  } catch (error) {
    console.error('Error reading directory contents:', error);
  }
}

// Function to copy the database if it doesn't exist
export const copyStaticDatabaseToDevice = async () => {
  // return;
  console.log('Inside copyStaticDatabaseToDevice function...');
  try {
    // Check if the database already exists
    const doesDeviceDBFileExist = await checkIfDeviceDatabaseFileExists();

    if (!doesDeviceDBFileExist) {
      console.log('Database does not exist, copying from assets...');

      // Load the asset from the bundled location
      // We need to pass in this hardcoded string since it seems that the require function does not work with dynamic paths..
      // ...at least not in the context of the Asset.fromModule function
      const dbFile = Asset.fromModule(require('../../assets/training_mode_local_dev.db'));
      await dbFile.downloadAsync();

      console.log('This is the local uri:', dbFile.localUri);

      // Copy the database file to the writable directory
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });
      await FileSystem.copyAsync({
        from: dbFile.localUri!,
        to: deviceDbAssetPath,
      });

      console.log('Database copied successfully!');
    } else {
      console.log('Database already exists, no need to copy.');
    }
  } catch (error) {
    console.error('Error copying database:', error);
  }
}

export const checkStaticGameDataVersionOnDevice = async () => {
  console.log('Checking database version...');
  const db = await deviceDBInit();

  const result = await db.select().from(metadata).where(eq(metadata.key, 'static_game_data_version'));

  const currentVersion = result[0]?.value;
  console.log('Current static game data version in device DB:', currentVersion);

  return currentVersion;
}


export const createBackupOfDeviceDatabase = async () => {
  const deviceDBPath = `${FileSystem.documentDirectory}SQLite/${deviceDBName}.db`;
  const deviceDBBackupPath = `${FileSystem.documentDirectory}SQLite/${deviceDBName}_backup.db`;

  try {
    const doesDeviceDBFileExist = await checkIfDeviceDatabaseFileExists();
    console.log('Does device db file exist:', doesDeviceDBFileExist);
    if (!doesDeviceDBFileExist) {
      console.log('Device database file not found. Cannot create backup.');
      return;
    }
    // Step 1: Create or update the primary backup
    await FileSystem.copyAsync({ from: deviceDBPath, to: deviceDBBackupPath });
    console.log('Primary backup created successfully at', deviceDBBackupPath);

    console.log('deviceDbBackupPath:', deviceDBBackupPath);
    // Shift existing backups and delete the oldest if necessary
    for (let i = MAX_DATABASE_BACKUPS - 1; i >= 1; i--) {
      // These includde the full path to the file (they include the `.db` extension)
      const oldBackupPath = `${deviceDBBackupPath}_${i}`;
      const newBackupPath = `${deviceDBBackupPath}_${i + 1}`;

      const backupExists = await FileSystem.getInfoAsync(oldBackupPath);
      if (backupExists.exists) {
        if (i === MAX_DATABASE_BACKUPS - 1) {
          // Delete the oldest backup if it exists
          await FileSystem.deleteAsync(oldBackupPath);
        } else {
          // Rename the backup to the next in the sequence
          await FileSystem.moveAsync({ from: oldBackupPath, to: newBackupPath });
        }
      }
    }

    // Create the new backup as `training_mode_device_backup_1.db`
    const newBackupPath = `${FileSystem.documentDirectory}SQLite/${deviceDBName}_backup_1.db`;
    // const deviceDbAssetPath = `${FileSystem.documentDirectory}SQLite/${deviceDBName}.db`;
    await FileSystem.copyAsync({ from: deviceDBPath, to: newBackupPath });
    console.log('Database backup created successfully.');

  } catch (error) {
    console.error('Error creating backup of device database:', error);
  }
}


