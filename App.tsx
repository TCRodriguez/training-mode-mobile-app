import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import GamesScreen from './src/screens/Games';
import SettingsScreen from './src/screens/Settings';
import { theme } from './src/styles/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    < NavigationContainer >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#333' },
          headerStyle: { backgroundColor: '#333' },
          headerTitleAlign: 'center',
        }}
      >
        <Tab.Screen name="Games" component={GamesScreen} />
        <Tab.Screen
          name="Settings"
          // options={{
          //   headerTitle: () => (
          //     <Image
          //       source={require('./assets/Training_Mode_Logo.png')}
          //       style={{ width: 40, height: 40 }}
          //     />
          //   )
          // }}
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
