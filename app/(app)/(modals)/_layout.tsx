import { Stack } from 'expo-router';

const _layout = () => {
   return (
      <Stack>
         <Stack.Screen name="barber" options={{ headerShown: false }} />
         <Stack.Screen name="booking" options={{ headerShown: false }} />
         <Stack.Screen name="appointment" options={{ headerShown: false }} />
         <Stack.Screen name="barber-appointment-view" options={{ headerShown: false }} />
      </Stack>
   );
};

export default _layout;
