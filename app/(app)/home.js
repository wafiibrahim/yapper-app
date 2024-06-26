import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { useAuth } from '../../context/authContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PostList from '../../components/PostList';
import Loading from '../../components/Loading';
import { onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { postsRef, usersRef } from '../../firebaseConfig';
import CreatePostModal from '../../components/CreatePostModal';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.uid) getUsers();
  }, []);

  const getUsers = async () => {
    const q = query(usersRef, where('userId', '!=', user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });
    setUsers(data);
  };

  useEffect(() => {
    if (user?.uid) getPosts();
  }, []);

  const getPosts = () => {
    const q = query(postsRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPosts(data);
    });

    return () => unsubscribe();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <View style={[styles.center, { top: hp(30) }]}>
          <Loading size={hp(10)} />
        </View>
      )}
      <CreatePostModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
