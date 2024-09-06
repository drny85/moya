import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, View } from 'react-native';
import { updateUser } from '~/actions/users';
import BarberCard from '~/components/BarberCard';
import { Toggle } from '~/components/nativewindui/Toggle';
import { useAllBarbers } from '~/hooks/useAllBarbers';
import { useAuth } from '~/providers/AuthContext';
import { Barber } from '~/shared/types';

const ManageBarbers = () => {
   const { user } = useAuth();
   const { loading, barbers } = useAllBarbers();

   if (!user?.isBarber) return null;
   if (!user.isOwner) return null;
   return (
      <View className="flex-1">
         <Text className=" ps-2 text-lg font-semibold text-muted">
            By deactivating a Barber, he wont show up on the app
         </Text>
         <FlashList
            data={barbers as Barber[]}
            estimatedItemSize={120}
            renderItem={({ item, index }) => (
               <BarberCard
                  index={index}
                  barber={item as Barber}
                  isOwner={true}
                  activeNode={
                     <View className="flex-row items-center gap-3">
                        <Text className="font-semibold">Activate</Text>
                        <Toggle
                           value={item.isActive}
                           onValueChange={(value) => {
                              updateUser({ ...item, isActive: value, isBarber: true });
                           }}
                        />
                     </View>
                  }
               />
            )}
         />
      </View>
   );
};

export default ManageBarbers;
