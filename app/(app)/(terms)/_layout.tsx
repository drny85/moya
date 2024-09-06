import { Stack } from 'expo-router';

const _layout = () => {
   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen
            name="barber-policy"
            options={{ title: 'Terms of Use', headerBackTitle: 'Back' }}
         />
         <Stack.Screen name="barber-terms" />
         <Stack.Screen name="customer-policy" />
         {/* <Stack.Screen name="login" /> */}
      </Stack>
   );
};

export default _layout;
