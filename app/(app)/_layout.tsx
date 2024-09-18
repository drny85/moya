import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, TouchableOpacity } from 'react-native';
import { BackButton } from '~/components/BackButton';
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle';
import { Fonts } from '~/constants/Fonts';
import '~/global.css';
import { useAppointments } from '~/hooks/useAppointments';
import { useProtectedRoute } from '~/hooks/useProtectedRoutes';
import { useUser } from '~/hooks/useUser';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
SplashScreen.preventAutoHideAsync();
export {
   // Catch any errors thrown by the Layout component.
   ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
   useInitialAndroidBarSync();
   const [loaded, error] = useFonts(Fonts);
   const { colorScheme, isDarkColorScheme, colors } = useColorScheme();
   useSchemeListener();
   useUser();
   useAppointments();
   const { mounted } = useProtectedRoute();

   useEffect(() => {
      if (loaded && !error && mounted) {
         SplashScreen.hideAsync();
      }
   }, [loaded, error]);

   if (!loaded && !error) {
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
                  <Stack.Screen
                     name="(auth)"
                     options={{
                        headerBackTitle: 'Back',
                        title: '',
                        headerShadowVisible: false,
                        headerStyle: {
                           backgroundColor: colors.background,
                        },
                        // headerTintColor: colors.grey,
                        headerTitleStyle: {
                           fontWeight: 'bold',
                           color: '#ffffff',
                        },
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                        //headerShown: false,
                        contentStyle: {
                           backgroundColor: colors.background,
                        },
                        headerLeft: () => (
                           <TouchableOpacity onPress={router.back}>
                              <Feather
                                 name="chevron-left"
                                 className="p-2"
                                 size={26}
                                 color={isDarkColorScheme ? '#ffffff' : '#212121'}
                              />
                           </TouchableOpacity>
                        ),
                        headerRight: () => {
                           return <ThemeToggle />;
                        },
                     }}
                  />
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

const useSchemeListener = () => {
   const { setColorScheme } = useColorScheme();
   useEffect(() => {
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
         Appearance.setColorScheme(colorScheme);
         console.log(colorScheme);
         //setColorScheme(colorScheme)
      });
      return () => {
         listener.remove();
      };
   }, []);
};
