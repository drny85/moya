import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { Alert } from 'react-native';
import { useAuth } from '~/providers/AuthContext';
import { storage } from '~/firebase';

export const usePhoto = () => {
   const progress = useSharedValue(0);
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
   const [photo, setPhoto] = useState<ImagePicker.ImagePickerResult | null>(null);

   const resetAll = () => {
      setPhoto(null);
      setSelectedImage(undefined);
      progress.value = 0;
   };

   const uploadPhoto = async (
      result: ImagePicker.ImagePickerResult,
      path: string
   ): Promise<boolean> => {
      try {
         if (!result.assets) {
            Alert.alert('Error', 'There are no photos');
            return false;
         }

         if (!path) {
            Alert.alert('Error', 'Path is required');
            return false;
         }
         setLoading(true);
         const uploadTasks = result.assets.map(async ({ uri }) => {
            const response = await fetch(uri);
            const blob = await response.blob();
            //const imageName = `${Date.now()}`

            const name = user?.id + '/' + path;
            const storageRef = ref(storage, name);

            const uploadTask = uploadBytesResumable(storageRef, blob);
            uploadTask.on(
               'state_changed',
               (snapshot) => {
                  //  const progress =
                  //     (snaphopt.bytesTransferred / snaphopt.totalBytes) * 100;
                  const progressValue = snapshot.bytesTransferred / snapshot.totalBytes;
                  progress.value = withTiming(progressValue, {
                     duration: 1000,
                  });
               },
               (error) => {
                  console.error('Error uploading image:', error);
               },
               async () => {
                  const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

                  setSelectedImage(imageUrl);
                  return imageUrl;
               }
            );
         });

         await Promise.all(uploadTasks);

         progress.value = withTiming(0, { duration: 1000 });
         return true;
         //    setUpload(false);
         //    setPhotos(null);
      } catch (error) {
         console.log('Error uploading images:', error);
         Alert.alert('Error', 'An error occurred while uploading images.');
         return false;
      } finally {
         setLoading(false);
      }
   };
   const handleImageUpload = async () => {
      try {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== 'granted') {
            Alert.alert(
               'Permission required',
               'Please allow access to your photo library to upload images.'
            );
            return;
         }

         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.3,
         });

         if (!result.canceled) {
            setPhoto(result);
            //setSelectedImages(uploadedImages);
            //updateProductImages([...product.images, ...uploadedImages]);
         }
      } catch (error) {
         console.error('Error uploading images:', error);
         Alert.alert('Error', 'An error occurred while uploading images.');
      }
   };

   return {
      handleImageUpload,
      progress,
      photo,
      loading,
      uploadPhoto,
      selectedImage,
      resetAll,
   };
};
