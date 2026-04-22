import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { initializeDatabase } from './src/database/databaseInit';
import HomeScreen from './src/screens/HomeScreen';
import AddressStepScreen from './src/screens/AddressStepScreen';
import PersonalInfoStepScreen from './src/screens/PersonalInfoStepScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setupDb = async () => {
      await initializeDatabase();
      setDbInitialized(true);
    };
    setupDb();
  }, []);

  if (!dbInitialized) {
    return null; // Or a splash screen / loading spinner
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1A2E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#F4F4F8' }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Usuários Cadastrados' }} 
        />
        <Stack.Screen 
          name="AddressStep" 
          component={AddressStepScreen} 
          options={{ title: 'Passo 1: Endereço' }} 
        />
        <Stack.Screen 
          name="PersonalInfoStep" 
          component={PersonalInfoStepScreen} 
          options={{ title: 'Passo 2: Dados Pessoais' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
