import { Tabs } from 'expo-router';
import { Image } from 'react-native';

import { TabBarIcon } from '../../../components/TabBarIcon';

import { useBarbers } from '~/hooks/useBarbers';
import { useNotifications } from '~/hooks/useNotification';
import { useColorScheme } from '~/lib/useColorScheme';

export default function TabLayout() {
   const { colors, isDarkColorScheme } = useColorScheme();

   useNotifications();
   useBarbers();

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: isDarkColorScheme ? 'orange' : colors.primary,
            tabBarInactiveTintColor: colors.accent,
            tabBarStyle: { backgroundColor: colors.background },
            headerStyle: {
               backgroundColor: colors.background,
            },
         }}>
         <Tabs.Screen
            name="index"
            options={{
               headerShown: false,
               title: 'Home',
               tabBarIcon: ({ color }) => (
                  <Image
                     source={require('~/assets/images/barbershop.png')}
                     tintColor={color}
                     className="-mb-1 h-8 w-8"
                  />
               ),
            }}
         />
         <Tabs.Screen
            name="barbers"
            options={{
               title: 'Barbers',
               headerTitle: 'Barbers',

               //headerShown: false,

               tabBarIcon: ({ color }) => <TabBarIcon name="scissors" color={color} />,
            }}
         />
         <Tabs.Screen
            name="appointments"
            options={{
               title: 'Appointments',
               headerShown: false,
               tabBarIcon: ({ color }) => (
                  <Image
                     source={require('~/assets/images/appointment.png')}
                     tintColor={color}
                     className="-mb-1 h-8 w-8"
                  />
               ),
            }}
         />
         <Tabs.Screen
            name="profile"
            options={{
               headerShown: false,

               tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
            }}
         />
      </Tabs>
   );
}
