import * as FileSystem from 'expo-file-system';
import gameData from '../../assets/data/gameData';





export const importJSONFilesFromDirectory = async (directoryPath: string) => {
  console.log(gameData);
  return;
  console.log('Importing JSON files from directory:', directoryPath);
  const files = await FileSystem.readDirectoryAsync(directoryPath);
  console.log('Files:', files)

  return;
  for (const file of files) {
    const filePath = `${directoryPath}/${file}`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    console.log('File info:', fileInfo);
    console.log('File path:', filePath);

    if (fileInfo.isDirectory) {
      // If it's a directory, recurse into it
      await importJSONFilesFromDirectory(filePath);
    } else if (file.endsWith('.json')) {
      // If it's a JSON file, read and import it
      const jsonData = await FileSystem.readAsStringAsync(filePath);
      const data = JSON.parse(jsonData);

      // Here, insert the data into your SQLite database using Drizzle ORM
      // await insertDataIntoDatabase(data);
    }
  }
}
