import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './src/screens/LoginPage/loginPage'; 
import AdminPage from './src/screens/AdminPage'; 
import EmployeePage from './src/screens/EmployeePage'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="EmployeePage" component={EmployeePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}