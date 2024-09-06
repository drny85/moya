import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLinking } from '~/hooks/useLinking';
import { AuthProvider } from '~/providers/AuthContext';

export default function Root() {
   useLinking();
   // useDevRoutes();
   // Set up the auth context and render our layout inside of it.
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AuthProvider>
            <BottomSheetModalProvider>
               <Slot />
            </BottomSheetModalProvider>
         </AuthProvider>
      </GestureHandlerRootView>
   );
}
