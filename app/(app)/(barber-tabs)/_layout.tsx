import { Redirect, Tabs } from 'expo-router';
import { Image } from 'react-native';

import { TabBarIcon } from '../../../components/TabBarIcon';

import { useAppointments } from '~/hooks/useAppointments';
import { useNotifications } from '~/hooks/useNotification';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';

export default function BarberTabLayout() {
   const { colors, isDarkColorScheme } = useColorScheme();
   const { user } = useAuth();
   useAppointments();
   useNotifications();
   if (!user) return <Redirect href={'/(app)/(tabs)'} />;
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: isDarkColorScheme ? 'orange' : colors.primary,
            tabBarInactiveTintColor: colors.accent,
            tabBarStyle: { backgroundColor: colors.background },
            headerStyle: {
               backgroundColor: colors.background,
            },
         }}>
         <Tabs.Screen
            name="barber-home"
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
            name="barber-appointments"
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
            name="gallery"
            options={{
               title: 'My Stuffs',
               headerShown: false,
               tabBarIcon: ({ color }) => <TabBarIcon name="stack-overflow" color={color} />,
            }}
         />
         <Tabs.Screen
            name="earnings"
            options={{
               title: 'Earnings',
               //headerShown: false,
               tabBarIcon: ({ color }) => <TabBarIcon name="dollar" color={color} />,
            }}
         />

         <Tabs.Screen
            name="barber-profile"
            options={{
               title: 'Profile',
               headerShown: false,

               tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
            }}
         />
      </Tabs>
   );
}
