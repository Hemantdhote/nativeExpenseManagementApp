/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RootNavigator from './src/routes/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="red" />
      <SafeAreaView style={{ flex: 1 }}>
        <RootNavigator />
        {/* <Text style={{flex:1, backgroundColor:"#3C3C3C", color:"white"}}>Hello</Text> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
