import { Stack } from 'expo-router';
import React from 'react';
import HomeHeader from '../../components/HomeHeader';
import ProfileHeader from '../../components/ProfileHeader';

const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerMode: 'screen',
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          header: () => <HomeHeader />,
          ...horizontalAnimation,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          header: () => <ProfileHeader />,
          ...horizontalAnimation,
        }}
      />
      <Stack.Screen
        name="createPost"
        options={{
          title: 'Create Post',
          ...horizontalAnimation,
        }}
      />
      <Stack.Screen
        name="comments"
        options={{
          title: 'Comments',
          ...horizontalAnimation,
        }}
      />
    </Stack>
  );
}
