import { ExpoConfig } from 'expo/config';
const config: ExpoConfig = {
   name: 'Moya Barber',
   slug: 'moya-barber',
   version: '1.0.1',
   scheme: 'moya-barber',
   web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
   },
   plugins: [
      'expo-router',
      'expo-font',
      [
         'expo-build-properties',
         {
            ios: {
               newArchEnabled: false,
            },
            android: {
               newArchEnabled: false,
            },
         },
      ],
      [
         'expo-dev-launcher',
         {
            launchMode: 'most-recent',
         },
      ],
      [
         'expo-image-picker',
         {
            photosPermission:
               'The app accesses your photos to let you share them with your friends or barber.',
         },
      ],
      [
         'expo-location',
         {
            locationAlwaysAndWhenInUsePermission:
               'Allow $(PRODUCT_NAME) to use your location to show the distance to your favorite barber-shop.',
         },
      ],
   ],
   experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
   },
   orientation: 'portrait',
   icon: './assets/icon.png',
   userInterfaceStyle: 'automatic',
   splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: {
         image: './assets/splash-dark.png',
         backgroundColor: '#2b2d42',
         resizeMode: 'contain',
      },
   },
   assetBundlePatterns: ['**/*'],

   ios: {
      supportsTablet: false,
      bundleIdentifier: 'net.robertdev.moyabarber',
      buildNumber: '1.0.1',
      infoPlist: {
         LSApplicationQueriesSchemes: ['tel'],
         NSLocationWhenInUseUsageDescription:
            'Allow $(PRODUCT_NAME) to use your location to show the distance to your favorite barber-shop.',
         NSLocationAlwaysAndWhenInUseUsageDescription:
            'Allow $(PRODUCT_NAME) to use your location to show the distance to your favorite barber-shop.',
      },
      config: {
         googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_IOS,
      },
      associatedDomains: ['applinks:moya-site.vercel.app'],
   },
   android: {
      adaptiveIcon: {
         foregroundImage: './assets/adaptive-icon.png',
         backgroundColor: '#ffffff',
      },
      softwareKeyboardLayoutMode: 'pan',
      package: 'net.robertdev.moyabarber',
      versionCode: 1,
      intentFilters: [
         {
            action: 'VIEW',
            autoVerify: true,
            data: [
               {
                  scheme: 'https',
                  host: 'moya-site.vercel.app',
                  pathPrefix: '/',
               },
            ],
            category: ['BROWSABLE', 'DEFAULT'],
         },
      ],
      config: {
         googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_ANDROID,
         },
      },
   },
   extra: {
      router: {
         origin: false,
      },
      eas: {
         projectId: '5e42d633-f94b-4a94-9618-141d98d3a454',
      },
   },
   updates: {
      url: 'https://u.expo.dev/5e42d633-f94b-4a94-9618-141d98d3a454',
   },
   runtimeVersion: {
      policy: 'appVersion',
   },
   owner: 'drny85',
};

export default config;
