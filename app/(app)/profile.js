import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../../context/authContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { onSnapshot, query, where } from 'firebase/firestore';
import { postsRef } from '../../firebaseConfig';
import Loading from '../../components/Loading';
import PostItem from '../../components/PostItem';
import CreatePostModal from '../../components/CreatePostModal';

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getUserPosts();
    }
  }, [user?.uid]);

  const getUserPosts = () => {
    const q = query(postsRef, where('userId', '==', user?.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size={hp(10)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostItem post={item} />}
        contentContainerStyle={styles.listContent}
      />
      <CreatePostModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: '#fff',
  },
  header: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: hp(2),
  },
});
