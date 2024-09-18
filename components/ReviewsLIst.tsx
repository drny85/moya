import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import ReviewCard from './ReviewCard';
import { useReviews } from '~/hooks/useReviews';
import { format } from 'date-fns';
import { Text } from './nativewindui/Text';
import ReviewSkelenton from './Skeletons/ReviesSkeleton';

type Props = {
   barberId: string;
};
const ReviewsList = ({ barberId }: Props) => {
   const { reviews, loading } = useReviews();
   const data = useMemo(
      () => reviews.filter((review) => review.barberId === barberId),
      [reviews, barberId]
   );

   if (loading) return <ReviewSkelenton />;

   if (data.length === 0)
      return (
         <View>
            <Text className="mt-10 text-center text-lg text-muted dark:text-white">
               No reviews yet
            </Text>
         </View>
      );
   return (
      <ScrollView style={styles.container} contentContainerClassName="mt-1 gap-2">
         {data
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((review) => (
               <ReviewCard
                  key={review.id}
                  {...review}
                  date={format(review.date, 'PPP')}
                  profileImage={review.profileImage || 'https://picsum.photos/seed/picsum/200/300'}
               />
            ))}
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
});

export default ReviewsList;
