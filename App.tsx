import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './src/routes/RootNavigator';
import { ExpenseProvider } from './src/context/ExpenseContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#3C3C3C" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3C3C3C" }}>
        <ExpenseProvider>
          <RootNavigator />
        </ExpenseProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;

