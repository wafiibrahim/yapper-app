// CommentItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

export default function CommentItem({ item }) {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentTimestamp}>
        {moment(item.timestamp.toDate()).fromNow()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
