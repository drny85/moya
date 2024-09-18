import { Feather } from '@expo/vector-icons';
import { BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { addNewService, updateService } from '~/actions/services';
import { updateUser } from '~/actions/users';
import ServicePicker from '~/components/Appointment/ServicePicker';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import PhotoGallery from '~/components/Gallery';
import IconImages from '~/components/IconImages';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { Text } from '~/components/nativewindui/Text';
import ReviewsList from '~/components/ReviewsLIst';
import Stepper from '~/components/Stepper';
import UploadPhoto from '~/components/UploadPhoto';
import { ICON_IMAGES } from '~/constants';
import { storage } from '~/firebase';
import { useServices } from '~/hooks/useServices';
import { toastAlert, toastMessage } from '~/lib/toast';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/providers/AuthContext';
import { IconNames, Photo, Service } from '~/shared/types';

const VALUES = ['Services', 'Photos', 'Reviews'];

const GalleryReviews = () => {
   const { user } = useAuth();

   const { services, loading } = useServices(user?.id!);
   const [icon, setIcon] = useState<IconNames | null>(null);
   const [edit, setEdit] = useState(false);
   const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
   const bottomSheetRef = useSheetRef();
   const descriptionRef = useRef<any>('');
   const [barberPhotos, setBarbersPhotos] = useState<Photo[]>([]);
   const { colors, isDarkColorScheme } = useColorScheme();
   const [selectedIndex, setSelectedIndex] = useState(0);

   const handleDeletePhoto = (photoId: string) => {
      Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
         { text: 'Cancel', style: 'cancel' },
         {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deletePhoto(photoId),
         },
      ]);
   };

   const addService = async (service: Service) => {
      if (!service.name)
         return toastMessage({
            title: 'Service Name Required',
            message: 'Please enter a service name',
            preset: 'error',
            duration: 3,
         });
      if (services.findIndex((s) => s.name.toLowerCase() === service.name.toLowerCase()) !== -1) {
         return toastAlert({
            title: 'Service Already Exists',
            message: 'You have already added this service',
            preset: 'error',
            duration: 3,
         });
      }

      try {
         if (!user?.id || !service) return;
         if (!icon) {
            return toastAlert({
               title: 'Icon Required',
               message: 'Please select an icon for the service',
               preset: 'error',
               duration: 3,
            });
         }
         const added = await addNewService(user.id, service);
         if (added) {
            toastMessage({
               title: 'Service Added',
               message: 'Service has been added successfully',
               preset: 'done',
               duration: 3,
            });
            setServiceToEdit(null);
            setEdit(false);

            bottomSheetRef.current?.close();
         }
         //updateUser({ ...user, services: newServices });
      } catch (error) {
         console.log(error);
      }
   };

   const onUpdateService = async (service: Service) => {
      try {
         if (!user?.id || !service) return;
         if (!icon) {
            return toastAlert({
               title: 'Icon Required',
               message: 'Please select an icon for the service',
               preset: 'error',
               duration: 3,
            });
         }
         const updated = await updateService(user.id, { ...service, icon });
         if (updated) {
            toastMessage({
               title: 'Service Updated',
               message: 'Service has been updated successfully',
               preset: 'done',
               duration: 3,
            });
            setServiceToEdit(null);
            setEdit(false);

            bottomSheetRef.current?.close();
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleValueChange = (value: number, to: 'duration' | 'price') => {
      if (!serviceToEdit) return;
      if (to === 'duration') {
         setServiceToEdit({ ...serviceToEdit, duration: value });
      }
      if (to === 'price') {
         setServiceToEdit({ ...serviceToEdit, price: value });
      }
   };

   const deletePhoto = async (photoId: string) => {
      try {
         if (!user || !user.isBarber) return;
         const newGallery = user?.gallery?.filter((photo) => photo.id !== photoId);
         const updated = await updateUser({ ...user, gallery: newGallery });
         if (updated) {
            const photoRef = ref(storage, `${user.id}/${photoId}`);
            deleteObject(photoRef)
               .then(() => {
                  toastMessage({
                     title: 'Photo Deleted',
                     message: 'Photo has been deleted successfully',
                     preset: 'done',
                     duration: 3,
                  });
               })
               .catch((error) => {
                  console.log('Error deleting photo from storage', error);
               });
         }
      } catch (error) {
         console.log('Error deleting photo from gallery', error);
      }
   };

   useEffect(() => {
      if (!user?.isBarber || !user || user.gallery.length === 0) return;
      setBarbersPhotos(user.gallery);
   }, [user?.gallery]);

   if (loading) return null;

   return (
      <Container>
         <View className="flex-1 bg-background">
            <SegmentedControl
               values={VALUES}
               fontStyle={{ fontSize: 16, color: isDarkColorScheme ? '#ffffff' : '#000000' }}
               tintColor={colors.accent}
               activeFontStyle={{
                  color: isDarkColorScheme ? '#212121' : '#ffffff',
                  fontWeight: '700',
                  fontSize: 18,
               }}
               style={{
                  backgroundColor: colors.card,
                  height: 40,
                  width: '80%',
                  alignSelf: 'center',
                  marginBottom: 10,
               }}
               selectedIndex={selectedIndex}
               onChange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
               }}
            />
            <View className="flex-1">
               {selectedIndex === 0 && (
                  <>
                     <Button
                        iconName="plus"
                        title="Add Service"
                        textStyle={{ color: '#ffffff' }}
                        style={{
                           alignSelf: 'center',
                           backgroundColor: colors.primary,
                           marginBottom: 2,
                        }}
                        onPress={() => bottomSheetRef.current?.present()}
                     />
                     <View className="flex-1 bg-background p-2">
                        {services.length > 0 && (
                           <ServicePicker
                              isBarber={true}
                              services={services}
                              onPressServiceEdit={(s) => {
                                 if (s.icon) {
                                    setIcon(s.icon);
                                 }
                                 setEdit(true);
                                 setServiceToEdit(s);
                                 bottomSheetRef.current?.present();
                              }}
                           />
                        )}
                     </View>
                  </>
               )}
               {selectedIndex === 1 && (
                  <View className="flex-1">
                     <View className="flex-row items-center justify-evenly">
                        <Text className="text-center text-lg font-bold">My Photos</Text>

                        <UploadPhoto />
                     </View>

                     <PhotoGallery photos={barberPhotos} onLongPress={handleDeletePhoto} />
                  </View>
               )}

               {selectedIndex === 2 && (
                  <View className="flex-1 bg-background p-2">
                     <ReviewsList barberId={user?.id!} />
                  </View>
               )}
            </View>
            <Sheet
               snapPoints={['85%']}
               ref={bottomSheetRef}
               onChange={(e) => {
                  if (e === -1) {
                     setServiceToEdit(null);
                     setEdit(false);
                  }
               }}>
               <View className="mt-4 flex-1 p-3">
                  <View>
                     <TouchableOpacity
                        className="flex-row items-center gap-1"
                        onPress={() => {
                           setEdit(false);
                           setServiceToEdit(null);

                           bottomSheetRef.current?.close();
                        }}>
                        <Feather name="chevron-left" size={26} />
                        <Text className="text-center text-lg">Edit Service</Text>
                     </TouchableOpacity>
                  </View>
                  <View className="gap-6">
                     <BottomSheetTextInput
                        style={{
                           backgroundColor: colors.card,
                           color: 'grey',
                           borderRadius: 10,
                           padding: 10,
                           marginTop: 10,
                           borderColor: colors.grey2,
                           borderWidth: 1,
                           height: 50,
                           fontSize: 16,
                        }}
                        defaultValue={serviceToEdit?.name}
                        autoFocus
                        value={serviceToEdit?.name}
                        autoCapitalize="words"
                        placeholder="Name"
                        onChangeText={(text) => setServiceToEdit({ ...serviceToEdit!, name: text })}
                     />
                     <BottomSheetTextInput
                        style={{
                           backgroundColor: colors.card,
                           color: 'grey',
                           borderRadius: 10,
                           padding: 10,
                           marginTop: 10,
                           borderColor: colors.grey2,
                           borderWidth: 1,
                           height: 50,
                           fontSize: 16,
                        }}
                        multiline
                        ref={descriptionRef}
                        defaultValue={serviceToEdit?.description}
                        value={serviceToEdit?.description}
                        autoCapitalize="none"
                        placeholder="Desciption"
                        onChangeText={(text) => (descriptionRef.current.value = text)}

                        //setServiceToEdit({ ...serviceToEdit!, description: text })
                     />
                     <View className="flex-row items-center justify-between ">
                        <Text className="text-xl font-semibold text-muted">Service Duration:</Text>
                        <Stepper
                           step={5}
                           minValue={10}
                           maxValue={100}
                           initialValue={serviceToEdit?.price}
                           onValueChange={(value) => handleValueChange(value, 'price')}
                        />
                     </View>
                     <View className="flex-row items-center justify-between">
                        <Text className="text-xl font-semibold text-muted">Service Price:</Text>
                        <Stepper
                           step={5}
                           minValue={10}
                           maxValue={80}
                           initialValue={serviceToEdit?.duration}
                           onValueChange={(value) => handleValueChange(value, 'duration')}
                        />
                     </View>
                     <View>
                        <Text className="text-xl font-semibold text-muted">Service Icon:</Text>
                        <IconImages
                           selected={icon}
                           icons={ICON_IMAGES}
                           onSelectIcon={(iconKey) => setIcon(iconKey)}
                        />
                     </View>
                     <Button
                        title={edit ? 'Update Service' : 'Add Service'}
                        onPress={() => {
                           const serv: Service = {
                              ...serviceToEdit!,
                              quantity: 1,
                              icon: icon || 'haircut',
                              description: descriptionRef.current.value || '',
                           };

                           if (edit) {
                              onUpdateService(serv);
                           } else {
                              addService(serv);
                           }
                        }}
                     />
                  </View>
               </View>
            </Sheet>
         </View>
      </Container>
   );
};

export default GalleryReviews;
