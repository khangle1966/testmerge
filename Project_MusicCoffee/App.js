import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Icon } from '@ui-kitten/components';
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import QueueScreen from './screens/QueueScreen';

// Tạo Stack Navigator cho Login
const Stack = createStackNavigator();
// Tạo Bottom Tab Navigator cho màn hình sau khi đăng nhập
const Tab = createBottomTabNavigator();

// Component chứa các tab "Tìm kiếm" và "Danh sách chờ"
function BottomTabs() {
  return (

    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3366FF', // Màu của tab khi được chọn
        tabBarInactiveTintColor: 'gray',  // Màu của tab khi không được chọn
        tabBarStyle: { display: 'flex' },  // Tùy chỉnh style của tab bar nếu cần
      }}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Queue" component={QueueScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* Khi người dùng đăng nhập thành công, điều hướng tới BottomTabs */}
            <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
