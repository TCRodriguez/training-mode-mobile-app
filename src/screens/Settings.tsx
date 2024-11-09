import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { theme } from '../styles/theme';
import GlobalContainer from '../components/Globalcontainer';
import GlobalText from '../components/GlobalText';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import { games } from '../db/schemas/gamesTableSchema';



const deviceDBName = process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME || 'default.db';

const expoDb = openDatabaseSync(`${deviceDBName}.db`); // Ensure the name matches your copied file
const db = drizzle(expoDb);
const SettingsScreen = () => {

  const [gamesData, setGamesData] = useState<any[]>([]);

  // Function to fetch games from the database
  const fetchGames = async () => {
    try {
      const results = await db.select().from(games);

      const formattedGames = results.map((game) => {
        // Return only the necessary fields, excluding created_at and updated_at
        const { created_at, updated_at, ...rest } = game;
        return rest;
      });

      console.log(formattedGames);
      setGamesData(formattedGames);

    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);


  return (
    <GlobalContainer>
      <GlobalText>Settings</GlobalText>
      <FlatList
        data={gamesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <GlobalText>{item.title}</GlobalText>
          </View>
        )}
      />
    </GlobalContainer>
  );
}

export default SettingsScreen;
