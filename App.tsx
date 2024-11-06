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
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as FileSystem from 'expo-file-system';
import { DATABASE_NAME } from '@env';

// const expoDb = openDatabaseSync(`${DATABASE_NAME}.db`);
//
// const db = drizzle(expoDb);

const Tab = createBottomTabNavigator();

// Function to print the contents of a directory
async function printDirectoryContents() {
  try {
    // Specify the directory you want to inspect
    const directoryPath = `${FileSystem.documentDirectory}SQLite`;

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

export default function App() {

  useEffect(() => {
    printDirectoryContents();

  }, []);



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
