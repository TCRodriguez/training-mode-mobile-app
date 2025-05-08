import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CharacterMovesScreen from './src/screens/CharacterMovesScreen';
import NotesScreen from './src/screens/NotesScreen';
import SettingsScreen from './src/screens/Settings';
import CogIcon from './assets/icons/CogIcon';
import DocumentIcon from './assets/icons/DocumentIcon';
import ListIcon from './assets/icons/ListIcon';
import FistIcon from './assets/icons/FistIcon';
import CharacterCombosScreen from './src/screens/CharacterCombosScreen';
import * as FileSystem from 'expo-file-system';
import {
  copyStaticDatabaseToDevice,
  printDirectoryContents,
} from './src/helpers/deviceDBHelpers';
import { updateStaticGameDataOnDevice } from './src/helpers/updateStaticGameDataOnDevice';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './src/db/migrations/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

const Tab = createBottomTabNavigator();

export default function App() {
  const deviceDBName = process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME;
  // TODO: This is creating an empty `training_mode_device` db file. Race condition.
  // Perhaps put this into a wrapper that calls copyStaticDatabaseToDevice and updateStaticGameDataOnDevice?

  const expoDb = openDatabaseSync(`${deviceDBName}.db`); // Ensure the name matches your copied file
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  // Expo Drizzle Studio Plugin will show blank db on first run
  // After first run, the db will be populated with the data from the static db via `copyStaticDatabaseToDevice` and `updateStaticGameDataOnDevice
  useDrizzleStudio(expoDb);

  useEffect(() => {
    // Define an async function inside the useEffect
    const initializeDatabase = async () => {
      // if (error) {
      //
      //   console.error('Error running migrations:', error);
      //   return;
      // }
      // if (!success) {
      //   console.log('Migrations are in progress...');
      //   return;
      // }

      // await printDirectoryContents(`${FileSystem.documentDirectory}SQLite`);

      // Copy the database to the device if it doesn't exist
      // This should only happen the very first time the user opens the app
      await copyStaticDatabaseToDevice();

      // Update the static game data on the device if the version is different
      await updateStaticGameDataOnDevice();
    };

    // Call the async function
    initializeDatabase();
  }, [success, error]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    < NavigationContainer >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#333' },
          headerStyle: { backgroundColor: '#333' },
          headerTitleAlign: 'center',
        }}
      >
        <Tab.Screen
          name="Moves"
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <ListIcon
                width={25}
                height={25}
                fill={color}
              />
            ),
          }}
          component={CharacterMovesScreen}
        />
        <Tab.Screen
          name="Notes"
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <DocumentIcon
                width={25}
                height={25}
                fill={color}
              />
            ),
          }}
          component={NotesScreen}
        />
        <Tab.Screen
          name="Combos"
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <FistIcon
                width={25}
                height={25}
                fill={color}
              />
            ),
          }}
          component={CharacterCombosScreen}
        />
        <Tab.Screen
          name="Settings"
          options={{
            // headerTitle: () => (
            //   <Image
            //     source={require('./assets/Training_Mode_Logo.png')}
            //     style={{ width: 40, height: 40 }}
            //   />
            // )
            tabBarIcon: ({ focused, color, size }) => (
              <CogIcon
                width={25}
                height={25}
                fill={color}
              />
            ),
          }}
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer >
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors['apex-blue'],
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
