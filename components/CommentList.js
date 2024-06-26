// CommentList.js
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CommentItem from './CommentItem';

export default function CommentList({ comments }) {
  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => <CommentItem item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.commentList}
    />
  );
}

const styles = StyleSheet.create({
  commentList: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
});
