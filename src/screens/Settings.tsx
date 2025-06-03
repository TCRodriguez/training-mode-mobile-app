import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { theme } from '../styles/theme';
import GlobalContainer from '../components/Globalcontainer';
import GlobalText from '../components/GlobalText';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import { games } from '../db/schemas/gamesTableSchema';
import { deviceDBInit } from '../helpers/deviceDBHelpers';



const deviceDBName = process.env.EXPO_PUBLIC_DEVICE_DATABASE_NAME || 'default.db';

// const expoDb = openDatabaseSync(`${deviceDBName}.db`); // Ensure the name matches your copied file
const SettingsScreen = () => {

  const [gamesData, setGamesData] = useState<any[]>([]);

  // Function to fetch games from the database
  const fetchGames = async () => {
    const db = await deviceDBInit();
    try {
      // const results = await db.select().from(games);
    
      // const formattedGames = results.map((game) => {
      //   // Return only the necessary fields, excluding created_at and updated_at
      //   const { created_at, updated_at, ...rest } = game;
      //   return rest;
      // });
    
      // console.log(formattedGames);
      // setGamesData(formattedGames);

      // const results = await db.query.games.findMany({
      //   where: (games, { eq }) => eq(games.id, 8), // Convenience condition to filter results
      //   with: {
      //     characters: true
      //   }
      // })

      // const results = await db?.query.characters.findMany({
      //   where: (characters, { eq }) => eq(characters.gameId, 8), // Convenience condition to filter results
      //   with: {
      //     // characterMoves: true,
      //     characterCombos: {
      //       with: {
      //         gameNotations: true,
      //         directionalInputs: true,
      //         attackButtons: true,
      //       }
      //     },
      //   }
      // })

      // const results = await db?.query.characterMoves.findFirst({
      //   where: (characterMoves, { eq }) => eq(characterMoves.characterId, 240), // Convenience condition to filter results
      //   with: {
      //     game: true,
      //     character: true,
      //   },
      // })

      // const results = await db?.query.games.findFirst({
      //   where: (games, { eq }) => eq(games.id, 8), // Convenience condition to filter results
      //   with: {
      //     characterMoves: {
      //       where: (characterMoves, { eq }) => eq(characterMoves.id, 3756), // Convenience condition to filter results
      //       with: {
      //         character: true
      //       }
      //     },
      //   },
      // })

      // attack buttons to character moves
      // const results = await db?.query.characterMoves.findFirst({
      //   where: (characterMoves, { eq }) => eq(characterMoves.characterId, 240), // Convenience condition to filter results
      //   with: {
      //     attackButtons: true
      //   }
      // })


      // directional inputs to character moves
      // const results = await db?.query.characterMoves.findFirst({
      //   where: (characterMoves, { eq }) => eq(characterMoves.id, 14), // Convenience condition to filter results
      //   with: {
      //     directionalInputs: true,
      //     attackButtons: true
      //   }
      // })
      // console.log(results);

      // Combos
      // const results = await db?.query.characterCombos.findMany({
      //   where: (characterCombos, { eq }) => eq(characterCombos.gameId, 8), // Convenience condition to filter results
      //   with: {
      //     // attackButtons: true,
      //     // directionalInputs: true,
      //     gameNotations: true,
      //     character: true,
      //     game: true,
      //   }
      // });
      const results = await db?.query.characters.findFirst({
        where: (characters, { eq }) => eq(characters.id, 222), // Convenience condition to filter results
        with: {
          characterCombos: true
        }
      });



      console.log(JSON.stringify(results, null, 2));
    
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
