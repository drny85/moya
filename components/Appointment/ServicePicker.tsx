import { TouchableOpacity, View } from 'react-native';
import { Text } from '../nativewindui/Text';
import { Toggle } from '../nativewindui/Toggle';
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useAuth } from '~/providers/AuthContext';
import { Service } from '~/shared/types';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

type Props = {
   services: Service[];
   isBarber: boolean;
   onPressServiceEdit?: (service: Service) => void;
} & (
   | {
        isBarber: false;
     }
   | {
        isBarber: true;
        onPressServiceEdit: (service: Service) => void;
     }
);

const ServicePicker = ({ services, isBarber, onPressServiceEdit }: Props) => {
   const { user } = useAuth();
   const { colors, isDarkColorScheme } = useColorScheme();
   const { selectedServices, setSelectedServiceOrRemoveService, onServiceQuantityUpdates } =
      useAppointmentFlowStore();

   const onAddPress = (service: Service) => {
      onServiceQuantityUpdates(service, service.quantity + 1);
   };
   const onRemovePress = (service: Service) => {
      if (service.quantity > 1) onServiceQuantityUpdates(service, service.quantity - 1);
   };
   return (
      <View className="m-2 rounded-2xl bg-card py-1 shadow-sm">
         {!user?.isBarber && (
            <Text className="text-center font-raleway-bold text-lg">Select a Service</Text>
         )}
         {services
            .sort((a, b) => (a.price < b.price ? 1 : -1))
            .map((service, index) => {
               const selectedIndex = selectedServices.findIndex((s) => s.id === service.id);
               const selected = selectedServices[selectedIndex];

               return (
                  <View
                     key={service.id}
                     className={`mx-2 flex-row items-center justify-between p-2 ${index !== services.length - 1 ? `border-b-hairline border-slate-300` : ''}`}>
                     <View className="flex-1 ">
                        <Text variant={'heading'}>{service.name}</Text>
                        <View className="flex-row items-center gap-2">
                           <Text className="text-sm font-bold text-muted dark:text-white">
                              ${service.price}
                           </Text>
                           <View className="h-1 w-1 rounded-full bg-slate-300" />
                           <Text className="text-sm text-muted dark:text-white">
                              {service.duration} mins
                           </Text>
                        </View>
                        {selectedIndex !== -1 && (
                           <Animated.View entering={FadeInUp} exiting={FadeOut}>
                              <View className="w-1/3 max-w-20 flex-row items-center justify-between py-1">
                                 <TouchableOpacity
                                    onPress={() => onRemovePress(selected)}
                                    className={`${selected.quantity === 1 ? 'opacity-30' : 'opacity-100'}`}
                                    disabled={selected.quantity === 1}>
                                    <Feather name="minus-circle" size={22} color={colors.accent} />
                                 </TouchableOpacity>
                                 <Text className="font-semibold text-muted dark:text-white">
                                    {selected.quantity}
                                 </Text>
                                 <TouchableOpacity onPress={() => onAddPress(selected)}>
                                    <Feather name="plus-circle" size={22} color={colors.accent} />
                                 </TouchableOpacity>
                              </View>
                           </Animated.View>
                        )}
                     </View>
                     <View className="w-1/5  items-center gap-y-2">
                        {isBarber ? (
                           <TouchableOpacity
                              className="flex-row items-center gap-2"
                              onPress={() => onPressServiceEdit(service)}>
                              <Feather
                                 name="edit"
                                 size={20}
                                 color={isDarkColorScheme ? '#ffffff' : '#212121'}
                              />
                              <Text>Edit</Text>
                           </TouchableOpacity>
                        ) : (
                           <Toggle
                              value={selectedIndex !== -1}
                              onChange={() => {
                                 setSelectedServiceOrRemoveService(service);
                              }}
                           />
                        )}
                     </View>
                  </View>
               );
            })}
      </View>
   );
};

export default ServicePicker;
