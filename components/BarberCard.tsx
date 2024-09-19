import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';

import { ReactNode } from 'react';
import { useReviews } from '~/hooks/useReviews';
import { useColorScheme } from '~/lib/useColorScheme';
import { Barber } from '~/shared/types';
import { Button } from './Button';
import CommunicationButtons from './CommunicationButtons';
import { Text } from './nativewindui/Text';

type Props = {
   barber: Barber;
   index: number;
   disabled?: boolean;
   isOwner?: boolean;
   activeNode?: ReactNode;
} & (
   | {
        isOwner: false;
     }
   | {
        isOwner: true;
        activeNode: ReactNode;
     }
);

const BarberCard = ({ barber, index, isOwner, activeNode, disabled = false }: Props) => {
   const { reviews } = useReviews();
   const { isDarkColorScheme } = useColorScheme();
   const barberReviews = reviews.filter((r) => r.barberId === barber?.id);
   const barberRating =
      barberReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0;

   if (!barber) return null;
   return (
      <Animated.View entering={SlideInLeft.delay(index * 200).duration(600)}>
         <TouchableOpacity
            disabled={disabled}
            onPress={() => router.push({ pathname: '/barber', params: { barberId: barber.id } })}
            className="m-2 rounded-lg bg-card">
            <View className="flex-row items-center gap-2">
               <Image
                  source={
                     barber.image ? { uri: barber.image } : require('~/assets/images/banner.png')
                  }
                  tintColor={!barber.image && isDarkColorScheme ? 'white' : undefined}
                  contentFit="cover"
                  contentPosition="center"
                  style={{
                     width: 100,
                     height: '100%',
                     overflow: 'hidden',
                     borderRadius: 10,
                  }}
               />
               <View className="flex-grow p-2">
                  <View className="flex-grow flex-row items-center justify-between ">
                     <Text className="text-lg font-bold">{barber.name}</Text>
                     <View className="min-w-24">
                        {barber.phone && <CommunicationButtons phone={barber.phone} />}
                     </View>
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                     <View className="flex-row items-center gap-1">
                        <FontAwesome name="star" size={20} color="orange" />
                        <Text className="text-muted opacity-80 dark:text-white">
                           {barberRating.toFixed(1)} rating
                        </Text>
                     </View>
                     {isOwner ? (
                        activeNode
                     ) : (
                        <Button
                           style={{ paddingVertical: 9 }}
                           title="Book Now"
                           onPress={() => {
                              router.push({
                                 pathname: '/booking',
                                 params: { barberId: barber.id },
                              });
                           }}
                        />
                     )}
                  </View>
               </View>
            </View>
            {/* <View className="flex-row gap-2">
       
      </View> */}
         </TouchableOpacity>
      </Animated.View>
   );
};

export default BarberCard;
