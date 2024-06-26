import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/authContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function PostItem({ post }) {
  const { user } = useAuth();
  const router = useRouter();

  const defaultProfileUrl =
    'https://i.pinimg.com/originals/83/aa/cd/83aacd323264609445e8dfcfdc643f1f.jpg'; // Default image URL

  const handleVote = async (type) => {
    const postRef = doc(db, 'posts', post.id);
    const newVotes = type === 'upvote' ? post.votes + 1 : post.votes - 1;

    try {
      await updateDoc(postRef, { votes: newVotes });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.profileUrl || defaultProfileUrl }}
          style={styles.profileImage}
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>
            {moment(post.timestamp.toDate()).fromNow()}
          </Text>
        </View>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.footer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity
            onPress={() => handleVote('upvote')}
            style={styles.voteButton}
          >
            <FontAwesome name="arrow-up" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.votes}>{post.votes}</Text>
          <TouchableOpacity
            onPress={() => handleVote('downvote')}
            style={styles.voteButton}
          >
            <FontAwesome name="arrow-down" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/comments?postId=${post.id}`)}
          style={styles.commentButton}
        >
          <FontAwesome name="comment-o" size={20} color="#4B5563" />
          <Text style={styles.comment}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginHorizontal: wp(4),
    marginVertical: hp(1),
    padding: wp(4),
    backgroundColor: '#fff',

    borderRadius: 15,
    shadowColor: '#C40C0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  profileImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    marginRight: wp(3),
  },
  headerText: {
    flexDirection: 'column',
  },
  username: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#111827',
  },
  timestamp: {
    fontSize: hp(1.6),
    color: '#9CA3AF',
  },
  content: {
    fontSize: hp(1.8),
    color: '#4B5563',
    marginBottom: hp(1),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(1),
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    marginVertical: hp(0.3),
  },
  votes: {
    marginVertical: hp(0.5),
    marginHorizontal: hp(0.5),
    fontSize: hp(2),
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#111827',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
  },
  comment: {
    marginLeft: wp(2),
    fontSize: hp(1.8),
    color: '#4B5563',
  },
});
