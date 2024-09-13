import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from './nativewindui/Text';
import { useAppointmentFlowStore } from '~/providers/useAppoitmentFlowStore';
import { Service } from '~/shared/types';
import { useColorScheme } from '~/lib/useColorScheme';
import { ICON_IMAGES, SIZES } from '~/constants';

interface TopServicesProps {
   services: Service[];
}

const TopServices: React.FC<TopServicesProps> = ({ services }) => {
   const [selected, setSelected] = useState<string>('');
   const { isDarkColorScheme } = useColorScheme();
   const setSelectedService = useAppointmentFlowStore((s) => s.setSelectedServiceOrRemoveService);
   return (
      <View className="gap-2 rounded-xl bg-card p-3">
         <Text variant="title3">Top Services</Text>
         {services.length === 0 && <Text className="mt-1 text-muted">No services listed</Text>}
         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {services
               .sort((a, b) => (a.id! > b.id! ? 1 : -1))
               .map((service, index) => (
                  <TouchableOpacity
                     onPress={() => {
                        setSelected(service.id!);
                        setSelectedService(service);
                     }}
                     key={index}
                     style={[
                        styles.serviceContainer,
                        selected === service.id && styles.selectedServiceContainer,
                     ]}>
                     <Image
                        tintColor={isDarkColorScheme ? 'white' : 'black'}
                        source={ICON_IMAGES[service.icon]}
                        style={styles.icon}
                     />
                     <Text className="text-xs">{service.name}</Text>
                     <View className="my-1 flex-row items-center gap-1">
                        <Text className="text-sm text-muted dark:text-slate-300">
                           ${service.price}
                        </Text>
                        <View className="h-1 w-1 rounded-full bg-slate-400" />
                        <Text className="text-sm text-muted dark:text-slate-300">
                           {service.duration} mins
                        </Text>
                     </View>
                  </TouchableOpacity>
               ))}
         </ScrollView>
      </View>
   );
};

const styles = StyleSheet.create({
   serviceContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      maxWidth: SIZES.width * 0.4,
      padding: 10,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#E5E5E5',
   },
   selectedServiceContainer: {
      borderColor: '#E5C07B',
      // backgroundColor: '#FAF3E8',
   },
   icon: {
      width: 40,
      height: 40,
      marginBottom: 8,
   },
   serviceText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#333333',
   },
});

export default TopServices;
