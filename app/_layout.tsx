import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useLinking } from '~/hooks/useLinking';
import { AuthProvider } from '~/providers/AuthContext';

export default function Root() {
   useLinking();
   useSchemeListener();
   // useDevRoutes();
   // Set up the auth context and render our layout inside of it.
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AuthProvider>
            <KeyboardProvider>
               <BottomSheetModalProvider>
                  <Slot />
               </BottomSheetModalProvider>
            </KeyboardProvider>
         </AuthProvider>
      </GestureHandlerRootView>
   );
}

const useSchemeListener = () => {
   useEffect(() => {
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
         Appearance.setColorScheme(colorScheme);
      });
      return () => {
         listener.remove();
      };
   }, []);
};
