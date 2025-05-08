import fs from 'fs';
import path from 'path';
import { confirm } from '@inquirer/prompts';
import { fileURLToPath } from 'url';

export const traverseDirectoryAndGetFiles = async (directory, fileList = [], substring = '') => {
  let files;

  try {
    files = fs.readdirSync(directory);
    // console.log(files);
  } catch (error) {
    console.error('Error opening directory:', error);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, check if the path contains the substring
      if (filePath.includes(substring)) {
        traverseDirectoryAndGetFiles(filePath, fileList, substring);
      } else {
        // Still traverse subdirectories in case they contain the substring
        traverseDirectoryAndGetFiles(filePath, fileList, substring);
      }
    } else if (filePath.endsWith('.json') && filePath.includes(substring)) {
      // If it's a JSON file and the path contains the substring, add it to the list
      fileList.push(filePath);
    }
  });

  return fileList;
}
/**
 * Reads JSON files and returns the parsed data
 * @param {Array} jsonFiles - An array of JSON file paths
 * @returns {Array} - An array of parsed JSON data
 */
export const readJsonFiles = async (jsonFiles) => {
  return jsonFiles.map(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error parsing JSON file: ${filePath}`, error);
      process.exit(1);
      return null;
    }
  }).filter(file => file !== null);
}

