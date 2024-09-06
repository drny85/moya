import { NOTIFICATION_TYPE } from '@shared/types';
import axios from 'axios';

export const sendPushNotification = async (
   id: string,
   notificationType: NOTIFICATION_TYPE,
   token: string,
   title: string,
   body: string
) => {
   const payload = {
      to: token,
      sound: 'default',
      title,
      body: body,
      data: { notificationType, id },
   };

   try {
      const response = await axios.post('https://exp.host/--/api/v2/push/send', payload, {
         headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
         },
      });

      console.log('Notification sent successfully:', response.data.status);
   } catch (error) {
      const err = error as any;
      console.error('Error sending notification:', err.response ? err.response.data : err.message);
   }
};
