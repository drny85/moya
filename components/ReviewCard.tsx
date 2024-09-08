import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Review } from '~/shared/types';
import { Text } from './nativewindui/Text';

const ReviewCard: React.FC<Review> = ({
   profileImage,
   name,
   date,
   rating,
   reviewTitle,
   reviewText,
}) => {
   const renderStars = (rating: number) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
         stars.push(
            <FontAwesome
               key={i}
               name={i <= rating ? 'star' : i - rating <= 0.5 ? 'star-half-full' : 'star-o'}
               size={18}
               color="#F5A623"
            />
         );
      }
      return stars;
   };

   return (
      <View className="rounded-lg bg-card p-3 shadow-sm ">
         <View style={styles.header}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View>
               <Text variant={'title3'}>{name}</Text>
               <Text className="text-sm text-muted dark:text-white">{date}</Text>
            </View>
         </View>
         <View className="mb-2 flex-row gap-1">{renderStars(rating)}</View>
         {reviewTitle && <Text>{`“${reviewTitle}”`}</Text>}
         {reviewText && <Text className="mb-2 text-sm dark:text-white">{reviewText}</Text>}
      </View>
   );
};

const styles = StyleSheet.create({
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
   },
   profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 8,
   },
   name: {
      fontWeight: 'bold',
      fontSize: 16,
   },
   date: {
      fontSize: 12,
      color: '#999999',
   },
   rating: {
      flexDirection: 'row',
      marginBottom: 8,
   },
   reviewTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 8,
   },
   reviewText: {
      fontSize: 14,
      color: '#555555',
      marginBottom: 8,
   },
   readMore: {
      color: '#007BFF',
      fontWeight: '600',
      fontSize: 14,
   },
});

export default ReviewCard;
