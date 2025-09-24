/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, createRef } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { createTables } from './src/utils/db/taskdb';
import store from './src/utils/redux/store';
import { setupNotifications } from './src/notifications/notifications';
import NavigationContainerComponent from './src/navigation/NavigationConatiner';

export const navRef = createRef();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {

  useEffect(() => {
    // Init DB
    createTables();
    const unsubscribe = setupNotifications();
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
          <NavigationContainerComponent />
        </NavigationContainer>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
