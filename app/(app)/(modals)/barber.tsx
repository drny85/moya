import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { addNewReview } from '~/actions/reviews';

import TimeSlotPickerComponent from '~/components/Appointment/TimeSlotsPicker';
import BarberImageHeader from '~/components/BarberImageHeader';
import { Button } from '~/components/Button';
import PhotoGallery from '~/components/Gallery';
import Loading from '~/components/Loading';
import Rating from '~/components/Rating';

import ReviewsList from '~/components/ReviewsLIst';
import ScheduleDayCard from '~/components/ScheduleDayCard';
import TopServices from '~/components/TopServices';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { Text } from '~/components/nativewindui/Text';
import { useServices } from '~/hooks/useServices';

import { toastAlert } from '~/lib/toast';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';
import { useAppointmentStore } from '~/providers/useAppointmentStore';
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore';
import { useBarbersStore } from '~/providers/useBarbersStore';
import { dayOrder, Days, Review, ScheduleDay } from '~/shared/types';

type ParamsProps = {
   barberId: string;
};

const VALUES = ['Info', 'Gallery', 'Reviews'];

const BarberDetails = () => {
   const { user } = useAuth();
   const { barberId } = useLocalSearchParams<ParamsProps>();
   const { loading, services } = useServices(barberId);
   const [rating, setRating] = useState(5);
   const [reviewTitle, setReviewTitle] = useState('');
   const reviewText = useRef('');
   const selectedServices = useAppointmentFlowStore((s) => s.selectedServices);
   const bottomSheetRef = useSheetRef();
   const appointments = useAppointmentStore((s) =>
      s.appointments.filter((a) => a.barber.id === barberId && a.customer.id === user?.id)
   );
   const hasConfirmedAppointmentWithBarber =
      appointments.findIndex((a) => a.status === 'completed') !== -1;
   const [selectedIndex, setSelectedIndex] = useState(0);

   const { colors, isDarkColorScheme } = useColorScheme();
   const { getBarberById } = useBarbersStore();
   const barber = getBarberById(barberId);

   const handleAddReview = async () => {
      const newReview: Review = {
         date: new Date().toISOString(),
         rating,
         name: user?.name || '',
         reviewText: reviewText.current,
         barberId: barberId,
         customerId: user?.id,
         profileImage: user?.image || '',
         reviewTitle: reviewTitle || 'No title',
      };
      try {
         const added = await addNewReview(newReview);
         if (added) {
            toastAlert({
               title: 'Review Added',
               message: 'Your review has been added successfully',
               duration: 3,
               preset: 'done',
            });
            bottomSheetRef.current?.close();
         }
      } catch (error) {
         console.log(error);
      }
   };

   const openReviewSheet = () => {
      if (!hasConfirmedAppointmentWithBarber) {
         toastAlert({
            title: 'No Completed Appointment',
            message: 'You must have a completed appointment with this barber to leave a review',
            duration: 4,
            preset: 'error',
         });
         return;
      }
      bottomSheetRef.current?.present();
   };

   if (!barber || loading) return <Loading />;

   return (
      <View className="mb-2 flex-1 bg-background">
         <BarberImageHeader barber={barber} onPressBack={router.back} showBookingButton={true} />
         <SegmentedControl
            values={VALUES}
            fontStyle={{ fontSize: 16, color: isDarkColorScheme ? '#ffffff' : '#212121' }}
            tintColor={colors.accent}
            activeFontStyle={{
               color: !isDarkColorScheme ? '#ffffff' : '#212121',
               fontWeight: '700',
               fontSize: 18,
            }}
            style={{
               backgroundColor: colors.card,
               height: 40,
               width: '80%',
               alignSelf: 'center',
               marginVertical: 10,
            }}
            selectedIndex={selectedIndex}
            onChange={(event) => {
               setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
         />

         {selectedIndex === 0 && (
            <ScrollView
               className="flex-1"
               contentContainerClassName="p-2 gap-4"
               showsVerticalScrollIndicator={false}>
               <View className="gap-7">
                  <View className="mt-2 gap-1">
                     <Text variant="title3">About {barber.name}</Text>
                     <Text className="opacity-60">{barber.bio}</Text>
                  </View>

                  <TopServices services={services} />

                  {services.length > 0 && selectedServices.length > 0 && (
                     <View className="gap-3 rounded-lg bg-card p-2">
                        <Text variant="title3">Available Appointments Today</Text>
                        <TimeSlotPickerComponent
                           barber={barber}
                           date={new Date()}
                           onTilePress={() => {
                              router.push({ pathname: '/booking', params: { barberId } });
                           }}
                        />
                     </View>
                  )}
               </View>
               <View className="rounded-lg bg-card shadow-sm">
                  <View className="p-2">
                     <Text className="mb-2" variant={'title3'}>
                        Schedule
                     </Text>
                     {Object.entries(barber.schedule)
                        .sort(
                           (a, b) => dayOrder.indexOf(a[0] as Days) - dayOrder.indexOf(b[0] as Days)
                        )
                        .map(([day, hours]) => {
                           if ((hours as ScheduleDay).isOff) return null;
                           const d = day as Days;
                           const slot = hours as ScheduleDay;
                           return <ScheduleDayCard key={d} day={d} slot={slot} />;
                        })}
                  </View>
               </View>
               <View className="h-6" />
            </ScrollView>
         )}
         {selectedIndex === 1 && (
            <View className="flex-1">
               <PhotoGallery photos={barber.gallery} />
            </View>
         )}

         {selectedIndex === 2 && (
            <View className="mb-4 flex-1 gap-2 p-2">
               <View className="flex-row items-center justify-between">
                  <Text className="font-semibold" variant={'title3'}>
                     Reviews
                  </Text>
                  <Button
                     textStyle={{ color: colors.grey }}
                     style={{ backgroundColor: colors.background, borderRadius: 10 }}
                     title="Add Review"
                     onPress={openReviewSheet}
                  />
               </View>
               <ScrollView showsVerticalScrollIndicator={false}>
                  <ReviewsList barberId={barberId} />
               </ScrollView>
            </View>
         )}
         <Sheet snapPoints={['80%']} ref={bottomSheetRef}>
            <View className="w-[90%] flex-1 items-center justify-center gap-4 self-center">
               <View>
                  <Text className="text-center text-lg text-muted">Select your rating</Text>
                  <Rating onChange={setRating} value={rating} />
               </View>
               <BottomSheetTextInput
                  className="w-full rounded-md bg-card p-3 shadow-sm"
                  value={reviewTitle}
                  onChangeText={setReviewTitle}
                  maxLength={40}
                  placeholder={`Rewiew Title / Heading`}
               />
               <BottomSheetTextInput
                  className="min-h-32 w-full rounded-md bg-card p-2 shadow-sm"
                  multiline
                  onChangeText={(text) => (reviewText.current = text)}
                  maxLength={200}
                  placeholder={`Write soemthing about ${barber?.name} here.`}
               />
               <View className="w-full flex-row items-center justify-evenly">
                  <Button
                     style={{ backgroundColor: 'grey' }}
                     title="Cancel"
                     onPress={() => bottomSheetRef.current?.close()}
                  />
                  <Button title="Submit Rating" onPress={handleAddReview} />
               </View>
            </View>
         </Sheet>
      </View>
   );
};

export default BarberDetails;
