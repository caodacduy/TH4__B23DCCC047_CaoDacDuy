import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppDataProvider } from './src/context/AppDataContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AppDataProvider>
      <SyncProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SyncProvider>
    </AppDataProvider>
  );
}

