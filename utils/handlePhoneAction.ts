import * as Linking from 'expo-linking';

type ActionType = 'call' | 'text';

export async function handlePhoneAction(
   type: ActionType,
   phoneNumber: string,
   message?: string
): Promise<void> {
   let url: string;

   if (type === 'call') {
      url = `tel:${phoneNumber}`;
   } else if (type === 'text') {
      url = `sms:${phoneNumber}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
   } else {
      throw new Error('Unsupported action type');
   }

   const supported = await Linking.canOpenURL(url);

   if (supported) {
      await Linking.openURL(url);
   } else {
      console.log(`${type} action is not supported on this device.`);
   }
}
