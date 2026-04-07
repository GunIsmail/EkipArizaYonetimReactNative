import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './src/screens/LoginPage/loginPage'; 
import AdminPage from './src/screens/AdminPage/AdminPage'; 
import EmployeePage from './src/screens/EmployeePage/EmployeePage'; 
import UserRegistrationPage from './src/screens/AdminPage/userRegistrationPage'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="EmployeePage" component={EmployeePage} />
        <Stack.Screen name="UserRegistrationPage" component={UserRegistrationPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}