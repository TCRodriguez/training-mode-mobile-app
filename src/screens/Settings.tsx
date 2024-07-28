import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import GlobalContainer from '../components/Globalcontainer';
import GlobalText from '../components/GlobalText';




const SettingsScreen = () => {
  return (
    <GlobalContainer>
      <GlobalText>Settings</GlobalText>
    </GlobalContainer>
  );
}

export default SettingsScreen;
