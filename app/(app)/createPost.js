import React, { useState, useRef, useEffect } from 'react';
import { blurhash } from '../../utils/common';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ios = Platform.OS === 'ios';

export default function CreatePost({ onPostCreated, autoFocus }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handlePost = async () => {
    if (!content) {
      Alert.alert('Error', 'Please enter some content.');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        content: content.trim(),
        userId: user.uid,
        username: user.displayName || user.email,
        timestamp: new Date(),
        votes: 0,
        profileUrl: user.photoURL || { blurhash }, // Ensure default URL if necessary
      };

      // Log data to console
      console.log('Post Data: ', postData);

      await addDoc(collection(db, 'posts'), postData);

      setLoading(false);
      Alert.alert('Success', 'Post created successfully!');
      onPostCreated();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
      console.error('Error adding document: ', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={ios ? 'padding' : 'height'}
      style={styles.container}
    >
      <View>
        <View style={styles.innerContainer}>
          <Text style={styles.label}>Yap About Something!</Text>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="What's on your mind?"
              placeholderTextColor="#555" // Darker placeholder text color
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePost}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Posting...' : 'Yap'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: wp(5),
    backgroundColor: '#fff',
  },
  innerContainer: {
    width: '100%',
  },
  label: {
    fontSize: hp(3),
    marginBottom: hp(2),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
    shadowColor: '#C40C0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
  },
  input: {
    height: hp(20), // Increased height for the input box
    flex: 1,
    color: '#000',
    textAlignVertical: 'top', // Ensures text starts at the top
  },
  button: {
    backgroundColor: '#C40C0C',
    paddingVertical: hp(2),
    width: hp(8),
    height: hp(8),
    borderRadius: hp(4), // Makes the button circular
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  buttonDisabled: {
    backgroundColor: '#c40c0c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
