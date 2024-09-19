import { Feather, FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunicationButtons from './CommunicationButtons';
import { Text } from './nativewindui/Text';

import { updateUser } from '~/actions/users';
import { useReviews } from '~/hooks/useReviews';
import { useAuth } from '~/providers/AuthContext';
import { Barber } from '~/shared/types';
import { shareBarberLink } from '~/utils/shareBarberLink';
import { router } from 'expo-router';
import { ImageBackground } from 'expo-image';
import { SIZES } from '~/constants';
import { useUser } from '~/hooks/useUser';
import { useColorScheme } from '~/lib/useColorScheme';
import { toastMessage } from '~/lib/toast';

type Props = {
   barber: Barber;
   onPressBack: () => void;
   showBookingButton?: boolean;
   showTopControl?: boolean;
};

const BarberImageHeader = ({
   barber,
   onPressBack,
   showBookingButton,
   showTopControl = true,
}: Props) => {
   const { top } = useSafeAreaInsets();
   useUser();
   const { colors, isDarkColorScheme } = useColorScheme();
   const { user } = useAuth();
   const { reviews } = useReviews();
   const barberReviews = reviews.filter((r) => r.barberId === barber.id);
   const barberRating =
      barberReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0;

   const toggleFavorite = async () => {
      if (!user) {
         toastMessage({
            title: 'Error',

            message: 'You not logged in',
            preset: 'error',
         });
      }
      if (!user || !barber) return;
      if (user.isBarber) return;

      try {
         await updateUser({ ...user, favoriteBarber: barber.id });
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Pressable
         disabled={showTopControl}
         onPress={() => router.push({ pathname: '/barber', params: { barberId: barber.id } })}>
         <ImageBackground
            contentFit="cover"
            transition={300}
            style={{
               height: SIZES.height * 0.26,
               borderRadius: 20,
               backgroundColor: colors.card,
               overflow: 'hidden',
            }}
            tintColor={barber.image ? undefined : isDarkColorScheme ? '#ddd' : '#212121'}
            source={barber.image ? { uri: barber.image } : require('~/assets/images/banner.png')}>
            {showTopControl && (
               <View className="absolute left-3 right-3 z-30 flex-row justify-between">
                  <TouchableOpacity
                     onPress={onPressBack}
                     className="z-30 rounded-full bg-slate-300 p-1"
                     style={{ top }}>
                     <Feather name="chevron-left" size={30} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => shareBarberLink(barber.id)}
                     className="rounded-full bg-slate-300 p-1"
                     style={{ top }}>
                     <Feather name="share" size={30} color="blue" />
                  </TouchableOpacity>
               </View>
            )}

            <BlurView
               intensity={70}
               tint="prominent"
               className="absolute bottom-0 left-0 right-0 z-10 gap-1 overflow-hidden rounded-b-2xl p-4">
               <View className="mb-2 flex-row items-center justify-between gap-3">
                  <View className="flex-row items-center justify-between gap-2">
                     <Text variant="title2" className="text-slate-700 dark:text-slate-200">
                        {barber.name}
                     </Text>

                     <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesome
                           name={
                              !user?.isBarber &&
                              user?.favoriteBarber &&
                              user.favoriteBarber === barber.id
                                 ? 'heart'
                                 : 'heart-o'
                           }
                           color="red"
                           size={26}
                        />
                     </TouchableOpacity>
                  </View>
                  {showBookingButton && (
                     <TouchableOpacity
                        onPress={() =>
                           router.push({
                              pathname: '/booking',
                              params: { barberId: barber.id },
                           })
                        }
                        className="mr-3 rounded-md bg-card px-3 py-1">
                        <Text className="font-bold text-accent">Book Now</Text>
                     </TouchableOpacity>
                  )}
               </View>
               <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                     <FontAwesome name="star" color="orange" size={20} />
                     <Text className="text-sm text-slate-500 dark:text-slate-200">
                        {barberRating.toFixed(1)} rating
                     </Text>
                     <Text className="text-sm text-muted dark:text-slate-200">
                        ({barberReviews.length} reviews)
                     </Text>
                  </View>
                  <View className="w-1/3  flex-row self-end">
                     <CommunicationButtons phone={barber.phone} />
                  </View>
               </View>
            </BlurView>
         </ImageBackground>
      </Pressable>
   );
};

export default BarberImageHeader;
