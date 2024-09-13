import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import BarberCard from '~/components/BarberCard';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import { useBarbersStore } from '~/providers/useBarbersStore';

const BarbersPage = () => {
   const { barbers } = useBarbersStore();

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
            contentContainerClassName="p-2"
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
               <BarberCard barber={item} index={index} isOwner={false} />
            )}
         />
      </Container>
   );
};

export default BarbersPage;
