import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const localDevDbName = process.env.EXPO_PUBLIC_LOCAL_DEV_DATABASE_NAME;
const deviceDBName = process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME;
const deviceDbAssetPath = `${FileSystem.documentDirectory}SQLite/${deviceDBName}.db`;


export const printDirectoryContents = async (directoryPath: string) => {
  try {
    // Check if the directory exists
    const dirInfo = await FileSystem.getInfoAsync(directoryPath);
    if (dirInfo.exists) {
      // Read the contents of the directory
      const contents = await FileSystem.readDirectoryAsync(directoryPath);
      console.log(`Contents of ${directoryPath}:`, contents);
    } else {
      console.log(`Directory ${directoryPath} does not exist.`);
    }
  } catch (error) {
    console.error('Error reading directory contents:', error);
  }
}

// Function to copy the database if it doesn't exist
export const copyDatabaseToWritableDirectory = async () => {
  try {
    // Check if the database already exists
    const fileInfo = await FileSystem.getInfoAsync(deviceDbAssetPath);

    if (!fileInfo.exists) {
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

