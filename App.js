import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/constants/ThemeContext';

import LoginPage from './src/screens/LoginPage/loginPage'; 
import AdminPage from './src/screens/AdminPage/AdminPage'; 
import EmployeePage from './src/screens/EmployeePage/EmployeePage'; 
import UserRegistrationPage from './src/screens/AdminPage/userRegistrationPage'; 

// --- Yeni Modüller ---
import TaskManagementPage from './src/screens/AdminPage/TaskManagementPage';
import AdminApprovalPage from './src/screens/AdminPage/AdminApprovalPage';
import ShowPersonelListPage from './src/screens/AdminPage/ShowPersonelListPage';
import AssignJobPage from './src/screens/AdminPage/AssignJobPage';
import BudgetManagementPage from './src/screens/AdminPage/BudgetManagementPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="AdminPage" component={AdminPage} />
          <Stack.Screen name="EmployeePage" component={EmployeePage} />
          <Stack.Screen name="UserRegistrationPage" component={UserRegistrationPage} />

          {/* Yeni Modül Ekranları */}
          <Stack.Screen name="TaskManagement" component={TaskManagementPage} />
          <Stack.Screen name="AdminApprovalPage" component={AdminApprovalPage} />
          <Stack.Screen name="ShowPersonelListPage" component={ShowPersonelListPage} />
          <Stack.Screen name="AssignJobPage" component={AssignJobPage} />
          <Stack.Screen name="BudgetManagement" component={BudgetManagementPage} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}