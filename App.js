import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AddStudentScreen from "./app/screens/AddStudentScreen";
import HomeScreen from "./app/screens/HomeScreen";
import ProfileScreen from "./app/screens/ProfileScreen";

const Stack = createStackNavigator();

const App = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name='AddStudent' component={AddStudentScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

export default App;
