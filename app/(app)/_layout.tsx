import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import 'expo-dev-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '~/global.css';
import { useFonts } from 'expo-font';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle';
import { useProtectedRoute } from '~/hooks/useProtectedRoutes';
import { useUser } from '~/hooks/useUser';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';
import { NAV_THEME } from '~/theme';
import { Fonts } from '~/constants/Fonts';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
export {
   // Catch any errors thrown by the Layout component.
   ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
   useInitialAndroidBarSync();
   const [loaded, error] = useFonts(Fonts);
   const { colorScheme, isDarkColorScheme } = useColorScheme();
   useUser();
   const { user } = useAuth();

   const { mounted } = useProtectedRoute(user);

   useEffect(() => {
      if (loaded || error) {
         SplashScreen.hideAsync();
      }
   }, [loaded, error]);

   if ((!loaded && !error) || !mounted) {
      return null;
   }

   // if (user && user.isBarber) return <Redirect href={'/(app)/(barber-tabs)'} />;

   return (
      <>
         <StatusBar
            key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
            style={isDarkColorScheme ? 'light' : 'dark'}
         />
         {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
         {/* <ExampleProvider> */}

         <ActionSheetProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
               <Stack screenOptions={{ ...SCREEN_OPTIONS }}>
                  <Stack.Screen name="(tabs)" options={TABS_OPTIONS} />
                  <Stack.Screen name="(barber-tabs)" options={TABS_OPTIONS} />
                  <Stack.Screen name="(auth)/index" options={TABS_OPTIONS} />
                  <Stack.Screen name="(terms)" options={TABS_OPTIONS} />
                  <Stack.Screen name="(modals)" options={TABS_OPTIONS} />
               </Stack>
            </NavThemeProvider>
         </ActionSheetProvider>

         {/* </ExampleProvider> */}
      </>
   );
}

const SCREEN_OPTIONS = {
   animation: 'ios',
   // for android
} as const;

const TABS_OPTIONS = {
   headerShown: false,
} as const;

const MODAL_OPTIONS = {
   presentation: 'modal',
   animation: 'fade_from_bottom', // for android
   title: 'Settings',
   headerRight: () => <ThemeToggle />,
} as const;
