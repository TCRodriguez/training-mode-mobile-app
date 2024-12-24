import {
  checkStaticGameDataVersionOnDevice,
  deviceStaticGameDataDBInit,
  createBackupOfDeviceDatabase
} from './deviceDBHelpers';
import { STATIC_GAME_DATA_VERSION } from '../globalConstants';

//TODO: Add in the various table imports?
import { games } from '../db/schemas/gamesTableSchema';




export const updateStaticGameDataOnDevice = async () => {

  // Opens connection to the static game data database on the device
  const staticGameDataDB = await deviceStaticGameDataDBInit();

  const result = await staticGameDataDB?.select().from(games);
  console.log('Result:', result);




  // Check the versions of the static game data on the device and the local version
  const deviceStaticDataVersion = await checkStaticGameDataVersionOnDevice();
  console.log('Device static data version:', deviceStaticDataVersion);
  const localStaticDataVersion = STATIC_GAME_DATA_VERSION;
  console.log('Local static data version:', localStaticDataVersion);

  // Doing a !== instead of > since there may be instances where I need to "roll the version back" on the device instead of assuming it's always going to be a higher version
  if (localStaticDataVersion !== deviceStaticDataVersion) {
    console.log('Updating static game data on device...');

    //TODO: LEFT OFF HERE
    //TODO: Add in the logic to update the static game data tables in the device db with the new data
    //TODO: Go through each table in static game data and update the device db with the new data wherever necessary?







    //TODO: After it's all said and done, update the metadata table in the device db file with the new version number
    // await createBackupOfDeviceDatabase();
  } else {
    console.log('Static game data is up to date on the device.');
  }




  
  return;



  // If the versions are the same, do nothing
  // If the device db file does not exist, do nothing


  // TODO: Add step that updates `static_game_data_version` in the metadata table on the device if the versions are different

}

