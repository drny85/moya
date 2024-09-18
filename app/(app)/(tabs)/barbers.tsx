import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import BarberImageHeader from '~/components/BarberImageHeader';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import BarbersSkelenton from '~/components/Skeletons/BarbersSkeleton';
import { useBarbersStore } from '~/providers/useBarbersStore';

const BarbersPage = () => {
   const { barbers, loading } = useBarbersStore();
   if (loading) return <BarbersSkelenton />;
   return (
      <Container>
         <FlashList
            data={barbers}
            estimatedItemSize={90}
            ListEmptyComponent={
               <View className="mt-10 flex-1 items-center justify-center">
                  <Text className="text-xl text-muted">No Barbers Found</Text>
               </View>
            }
            contentContainerClassName="p-2 mb-3"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
               <View className="m-2">
                  <BarberImageHeader
                     showTopControl={false}
                     barber={item}
                     showBookingButton={true}
                     onPressBack={() => {}}
                  />
               </View>
               // <BarberCard barber={item} index={index} isOwner={false} />
            )}
         />
      </Container>
   );
};

export default BarbersPage;
