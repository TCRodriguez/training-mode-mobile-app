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


const Tab = createBottomTabNavigator();


export default function App() {
  useEffect(() => {
    // Define an async function inside the useEffect
    const initializeDatabase = async () => {
      // await printDirectoryContents(`${FileSystem.documentDirectory}SQLite`);

      // Copy the database to the device if it doesn't exist
      await copyStaticDatabaseToDevice();


      // Update the static game data on the device if the version is different
      await updateStaticGameDataOnDevice();
    };

    // Call the async function
    initializeDatabase();
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
