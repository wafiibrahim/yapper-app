// Comments.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/authContext'; // Adjust the path as necessary
import { db } from '../../firebaseConfig'; // Adjust the path as necessary
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import moment from 'moment';
import { useSearchParams } from 'expo-router';

export default function Comments() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const postId = params.get('postId');

  useEffect(() => {
    if (!postId || !user) return;

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId, user]);

  const handleAddComment = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content.');
      return;
    }

    setLoading(true);

    try {
      const newComment = {
        content: content.trim(),
        postId,
        userId: user.uid,
        username: user.displayName || user.email,
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'comments'), newComment);
      setContent('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentTimestamp}>
        {moment(item.timestamp.toDate()).fromNow()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentList}
        />
      ) : (
        <View style={styles.noComments}>
          <Text style={styles.noCommentsText}>No comments yet.</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#666"
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddComment}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentList: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  commentContainer: {
    marginBottom: hp(2),
    padding: wp(3),
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  commentUsername: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#333',
  },
  commentContent: {
    fontSize: hp(1.8),
    color: '#555',
    marginVertical: hp(0.5),
  },
  commentTimestamp: {
    fontSize: hp(1.6),
    color: '#999',
    textAlign: 'right',
  },
  noComments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: hp(2),
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: hp(6),
    paddingHorizontal: wp(3),
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  button: {
    marginLeft: wp(2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: '#C40C0C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#c40c0c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
