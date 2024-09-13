import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { NotificationData } from '~/shared/types';

export function useNotificationObserver() {
   useEffect(() => {
      let isMounted = true;

      function redirect(notification: Notifications.Notification) {
         const data = notification.request.content.data as NotificationData;
         console.log('data', data);
         if (
            data.notificationType === 'new-appointment' ||
            data.notificationType === 'appointment-updates'
         ) {
            router.push({
               pathname: '/barber-appointment-view',
               params: { appointmentId: data.id },
            });
         }
         if (data.notificationType === 'reminder') {
            router.push({
               pathname: '/appointment',
               params: { appointmentId: data.id },
            });
         }
      }

      Notifications.getLastNotificationResponseAsync().then((response) => {
         if (!isMounted || !response?.notification) {
            return;
         }
         redirect(response?.notification);
      });

      const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
         redirect(response.notification);
      });

      return () => {
         isMounted = false;
         subscription.remove();
      };
   }, []);
}
