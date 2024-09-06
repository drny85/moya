import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, CollectionReference, DocumentData, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Appointment, AppUser, Response, Review, Service } from './shared/types';

// import { getFunctions} from 'firebase/functions';

const firebaseConfig = {
   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const functions = getFunctions(app, 'us-central1');
const storage = getStorage(app);

// const functions = getFunctions(app, 'us-central1');
export const createCollection = <T = DocumentData>(collectionName: string) => {
   return collection(db, collectionName) as CollectionReference<T>;
};
export const deleteUserFunction = httpsCallable<{}, Response>(functions, 'deleteUser');
export const usersCollection = createCollection<AppUser>('users');
export const appointmentsCollection = createCollection<Appointment>('appointments');
export const reviewsCollection = createCollection<Review>('reviews');
export const servicesCollection = (barberId: string) =>
   createCollection<Service>(`services/${barberId}/services`);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { auth, db, storage };
