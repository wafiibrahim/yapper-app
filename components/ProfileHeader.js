import { View, Text, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { useAuth } from '../context/authContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { MenuItem } from '../components/CustomMenuItems';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const ios = Platform.OS === 'ios';

export default function ProfileHeader() {
  const { top } = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const handleHome = () => {
    router.push('/home');
  };

  const handleLogout = async () => {
    await logout();

    if (response.success) {
      Alert.alert('Logout', 'Logout successful!');
    } else {
      Alert.alert('Logout', response.msg);
    }
  };

  return (
    <View
      style={{
        paddingTop: ios ? top : top + 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        backgroundColor: '#C40C0C',
        paddingBottom: hp(2),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        alignItems: 'center',
      }}
    >
      <View>
        <Text style={{ fontSize: hp(3), fontWeight: '500', color: '#FFF' }}>
          My Yaps
        </Text>
      </View>

      <Menu>
        <MenuTrigger
          customStyles={{
            triggerWrapper: { padding: 5 },
            TriggerTouchableComponent: TouchableOpacity,
          }}
        >
          <Image
            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
            source={user?.photoURL}
            placeholder={{ blurhash }}
            transition={500}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: 10,
              borderCurve: 'continuous',
              marginTop: 40,
              marginLeft: -30,
              backgroundColor: 'white',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 0 },
              width: 160,
            },
          }}
        >
          <MenuItem
            text="Home"
            action={handleHome}
            value={null}
            icon={
              <Feather name="user" size={hp(2.5)} color="#737373"></Feather>
            }
          ></MenuItem>
          <Divider></Divider>
          <MenuItem
            text="Sign Out"
            action={handleLogout}
            value={null}
            icon={
              <AntDesign
                name="logout"
                size={hp(2.5)}
                color="#737373"
              ></AntDesign>
            }
          ></MenuItem>
        </MenuOptions>
      </Menu>
    </View>
  );
}

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
