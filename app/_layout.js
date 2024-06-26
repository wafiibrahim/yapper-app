import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import '../global.css';
import { AuthContextProvider, useAuth } from '../context/authContext';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MenuProvider } from 'react-native-popup-menu';
import { NavigationContainer } from '@react-navigation/native';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == 'undefined') return;
    const inApp = segments[0] == '(app)';
    if (isAuthenticated && !inApp) {
      //redirect to home

      router.replace('home');
    } else if (isAuthenticated == false) {
      //redirect to signin

      router.replace('signIn');
    }
  }, [isAuthenticated]);

  return <Slot></Slot>;
};

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <GestureHandlerRootView>
          <MainLayout />
        </GestureHandlerRootView>
      </AuthContextProvider>
    </MenuProvider>
  );
}
