import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { updateUser } from '~/actions/users';
import { storage } from '~/firebase';
import { useAuth } from '~/providers/AuthContext';
import ProgressBar from './ProgressBar';
import { Button } from './Button';
import { toastMessage } from '~/lib/toast';
import { MAXIMUM_IMAGES_UPLOAD } from '~/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const UploadPhoto: React.FC = () => {
   const { user } = useAuth();
   const progress = useSharedValue(0);
   const { colors } = useColorScheme();
   const [uploading, setUploading] = useState(false);

   const pickAndUploadImage = async () => {
      if (user?.gallery && user?.gallery?.length >= MAXIMUM_IMAGES_UPLOAD) {
         return Alert.alert(
            'Limit Reached',
            'You have reached the limit of 10 photos in your gallery.'
         );
      }
      if (!user || !user.gallery) return Alert.alert('Error', 'No user is logged in.');
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Permission denied', 'We need camera roll permissions to make this work!');
         return;
      }

      // Select an image
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.3,
      });

      if (!result.canceled) {
         const selectedImageUri = result.assets[0].uri;
         // Upload the image
         setUploading(true);
         try {
            const response = await fetch(selectedImageUri);
            const blob = await response.blob();
            const id = new Date().getTime().toString();
            const storageRef = ref(storage, `${user.id}/${id}`);
            //    await uploadBytes(storageRef, blob);
            const uploadTask = uploadBytesResumable(storageRef, blob);
            uploadTask.on(
               'state_changed',
               (snapshot) => {
                  const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  progress.value = withTiming(progressValue, {
                     duration: 1000,
                  });
               },
               (error) => {
                  console.log('Error uploading image: ', error);
               },
               async () => {
                  const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  await updateUser({
                     ...user,
                     gallery: [
                        { id, uri: downloadUrl, date: new Date().toISOString() },
                        ...user.gallery!,
                     ],
                  });

                  toastMessage({
                     title: 'Image Uploaded',
                     message: 'New photo has been added!',
                     preset: 'done',
                  });
               }
            );
            const downloadUrl = await getDownloadURL(storageRef);
            await updateUser({
               ...user,
               gallery: [{ id, uri: downloadUrl, date: new Date().toISOString() }, ...user.gallery],
            });
         } catch (error) {
            console.log('Error uploading image: ', error);
            //Alert.alert('Upload Failed', 'There was an error uploading your image.');
         } finally {
            setUploading(false);
         }
      }
   };

   return (
      <View>
         <Button
            iconName="plus"
            title="Upload Photo"
            onPress={pickAndUploadImage}
            textStyle={{ color: '#ffffff' }}
            style={{
               alignSelf: 'center',
               backgroundColor: colors.primary,
               marginBottom: 2,
            }}
            disabled={uploading}
         />
         {uploading && progress && <ProgressBar progress={progress} />}
      </View>
   );
};

export default UploadPhoto;
