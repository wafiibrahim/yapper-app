import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostItem from './PostItem';

export default function PostList({ posts }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostItem post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
});
