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
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './src/db/migrations/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as FileSystem from 'expo-file-system';
import { seedGames } from './src/db/seeders/gameSeeder.mjs';
import { DATABASE_NAME } from '@env';

const expoDb = openDatabaseSync(DATABASE_NAME);

const db = drizzle(expoDb);

const Tab = createBottomTabNavigator();

export default function App() {
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}.db`;
  console.log('Database file path:', dbFilePath);

  useDrizzleStudio(expoDb);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    const initializeDatabase = async () => {
      console.log('Initializing database...');
      await seedGames(dbFilePath);
      console.log('Finished seeding games');
    };

    if (success) {
      initializeDatabase();
    }
  }, [success, dbFilePath]);






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

  console.log('right before seedGames');
  seedGames(dbFilePath);
  // useEffect(() => {
  //   (async () => {
  //     await seedGames(dbFilePath);
  //   })();
  // }, []);




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
