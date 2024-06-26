import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth(); // Importing login function from AuthContext
  const [loading, setLoading] = useState(false);
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Sign In', 'Please fill all the fields!');
      return;
    }

    setLoading(true);

    let response = await login(emailRef.current, passwordRef.current);

    setLoading(false);

    if (!response.success) {
      Alert.alert('Sign In', response.msg);
    } else {
      // Redirect to the main page or home page after successful login
      router.push('/home'); // Adjust this route based on your app's structure
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5), flex: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: hp(2) }}>
          <Image
            style={{ height: hp(30) }}
            resizeMode="contain"
            source={require('../assets/images/yapper.png')}
          />
        </View>

        <View style={{ marginBottom: hp(3) }}>
          <Text
            style={{
              fontSize: hp(4),
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#4B5563',
            }}
          >
            Sign In
          </Text>
        </View>

        <View style={{ marginBottom: hp(2) }}>
          <View
            style={{
              height: hp(7),
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              paddingHorizontal: wp(3),
              marginBottom: hp(2),
            }}
          >
            <Octicons name="mail" size={hp(2.7)} color="gray" />
            <TextInput
              onChangeText={(value) => (emailRef.current = value)}
              style={{
                fontSize: hp(2),
                flex: 1,
                fontWeight: 'bold',
                color: '#374151',
                marginLeft: wp(2),
              }}
              placeholder="Email Address"
              placeholderTextColor="gray"
            />
          </View>

          <View
            style={{
              height: hp(7),
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              paddingHorizontal: wp(3),
            }}
          >
            <Octicons name="lock" size={hp(2.7)} color="gray" />
            <TextInput
              onChangeText={(value) => (passwordRef.current = value)}
              style={{
                fontSize: hp(2),
                flex: 1,
                fontWeight: 'bold',
                color: '#374151',
                marginLeft: wp(2),
              }}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="gray"
            />
          </View>
        </View>

        <Text
          style={{
            fontSize: hp(1.8),
            fontWeight: 'bold',
            textAlign: 'right',
            color: '#6B7280',
            marginBottom: hp(2),
          }}
        >
          Forgot Password?
        </Text>

        <View>
          {loading ? (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Loading size={hp(6.5)} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: '#C40C0C',
                paddingVertical: hp(1.5),
                alignItems: 'center',
                borderRadius: 20,
                marginTop: hp(2),
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.7),
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: hp(3),
          }}
        >
          <Text
            style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#6B7280' }}
          >
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('signUp')}>
            <Text
              style={{
                fontSize: hp(1.8),
                fontWeight: 'bold',
                color: '#C40C0C',
              }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
