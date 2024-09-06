import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { doc, setDoc } from 'firebase/firestore';
import { usersCollection } from '~/firebase';
import { useAuth } from '~/providers/AuthContext';
import { NotificationData } from '~/shared/types';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
   handleNotification: async (notification) => {
      return {
         shouldShowAlert: true,
         shouldPlaySound: true,
         shouldSetBadge: false,
      };
   },
});

export const useNotifications = () => {
   const notificationListener = useRef<any>();
   const responseListener = useRef<any>();
   const { user } = useAuth();

   useEffect(() => {
      if (!user) return;

      registerForPushNotificationsAsync();

      notificationListener.current = Notifications.addNotificationReceivedListener(
         (notification) => {
            console.log('NOTIFIACTION', notification.request.content.data);
         }
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
         (response) => {
            console.log('NOTIFIACTION RESPONSE', response.notification.request.content.data);
            const { id, notificationType } = response.notification.request.content
               .data as NotificationData;
            if (
               notificationType === 'new-appointment' ||
               notificationType === 'appointment-updates'
            ) {
               router.push({
                  pathname: '/barber-appointment-view',
                  params: { appointmentId: id },
               });
            }
         }
      );

      return () => {
         notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
         responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
      };
   }, [user]);

   const registerForPushNotificationsAsync = async () => {
      try {
         if (Device.isDevice) {
            console.log('Registering for push notifications');
            const { status: existingStatus } = await Notifications.requestPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
               const { status } = await Notifications.getPermissionsAsync();
               finalStatus = status;
            }

            if (finalStatus !== 'granted') {
               const { canAskAgain } = await Notifications.getPermissionsAsync();
               if (canAskAgain) {
                  const { status } = await Notifications.requestPermissionsAsync();
                  finalStatus = status;
               }

               return;
            }
            console.log('Final status', finalStatus);

            if (user?.pushToken) return;
            console.log('Getting push token');
            const token = await Notifications.getExpoPushTokenAsync({
               projectId: Constants.expoConfig?.extra?.eas.projectId,
            });
            console.log('Push token', token);
            if (token) await assignTokenToUser(user?.id!, token.data);

            if (Platform.OS === 'android') {
               Notifications.setNotificationChannelAsync('default', {
                  name: 'default',
                  importance: Notifications.AndroidImportance.MAX,
                  vibrationPattern: [0, 250, 250, 250],
                  lightColor: '#fefefe',
               });
            }
         }
      } catch (error) {
         const err = error as any;
         console.log('Error from useNotifications hooks', err.message);
      }
   };

   return { registerForPushNotificationsAsync };
};

async function assignTokenToUser(userId: string, token: string) {
   try {
      if (!userId || !token) return;
      const userRef = doc(usersCollection, userId);
      await setDoc(userRef, { pushToken: token }, { merge: true });
   } catch (error) {
      console.log('Error from assignTokenToUser', error);
   }
}

export async function registerForPushNotificationsAsync() {
   if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
         name: 'default',
         importance: Notifications.AndroidImportance.MAX,
         vibrationPattern: [0, 250, 250, 250],
         lightColor: '#FF231F7C',
      });
   }

   if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== 'granted') {
         handleRegistrationError('Permission not granted to get push token for push notification!');
         return;
      }
      const projectId =
         Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
         handleRegistrationError('Project ID not found');
      }
      try {
         const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
               projectId,
            })
         ).data;
         console.log(pushTokenString);
         return pushTokenString;
      } catch (e: unknown) {
         handleRegistrationError(`${e}`);
      }
   } else {
      handleRegistrationError('Must use physical device for push notifications');
   }
}

function handleRegistrationError(errorMessage: string) {
   alert(errorMessage);
   throw new Error(errorMessage);
}
