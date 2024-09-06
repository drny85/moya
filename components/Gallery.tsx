import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
   Animated,
   Dimensions,
   Modal,
   PanResponder,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Photo } from '~/shared/types';
import { Text } from './nativewindui/Text';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const PhotoGallery: React.FC<{ photos: Photo[]; onLongPress?: (id: string) => void }> = ({
   photos,
   onLongPress,
}) => {
   const { top } = useSafeAreaInsets();

   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
   const position = new Animated.ValueXY();

   const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
         position.setValue({ x: dx, y: 0 });
      },
      onPanResponderRelease: (_, { dx }) => {
         const threshold = width / 4;
         if (dx > threshold && selectedIndex !== null) {
            handlePrev();
         } else if (dx < -threshold && selectedIndex !== null) {
            handleNext();
         } else {
            Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
         }
      },
   });

   const handleNext = () => {
      if (selectedIndex !== null && selectedIndex < photos.length - 1) {
         Animated.timing(position, {
            toValue: { x: -width, y: 0 },
            duration: 200,
            useNativeDriver: true,
         }).start(() => {
            setSelectedIndex(selectedIndex + 1);
            position.setValue({ x: 0, y: 0 });
         });
      }
   };

   const handlePrev = () => {
      if (selectedIndex !== null && selectedIndex > 0) {
         Animated.timing(position, {
            toValue: { x: width, y: 0 },
            duration: 200,
            useNativeDriver: true,
         }).start(() => {
            setSelectedIndex(selectedIndex - 1);
            position.setValue({ x: 0, y: 0 });
         });
      }
   };

   const renderPhoto = (item: { id: string; uri: string }, index: number) => {
      return (
         <TouchableOpacity
            onLongPress={() => {
               onLongPress?.(item.id);
            }}
            key={item.id}
            onPress={() => setSelectedIndex(index)}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
         </TouchableOpacity>
      );
   };

   if (photos.length === 0)
      return (
         <View className="m-10 items-center justify-center">
            <Text className="mt-10">No photos available</Text>
         </View>
      );

   return (
      <View style={styles.container}>
         <View className="flex-1">
            <ScrollView contentContainerStyle={styles.gallery} showsVerticalScrollIndicator={false}>
               {photos.map((photo, index) => renderPhoto(photo, index))}

               <View className="h-12" />
            </ScrollView>
         </View>
         {selectedIndex !== null && (
            <Modal visible={true} transparent={true}>
               <View
                  style={{
                     position: 'absolute',
                     top,
                     right: 20,
                     height: 30,
                     width: 30,
                     borderRadius: 15,
                     alignItems: 'center',
                     justifyContent: 'center',
                     backgroundColor: 'white',
                     zIndex: 20,
                  }}>
                  <TouchableOpacity onPress={() => setSelectedIndex(null)}>
                     <FontAwesome name="close" size={24} color={'black'} />
                  </TouchableOpacity>
               </View>
               <View style={styles.fullScreenContainer}>
                  <Animated.View
                     style={[
                        styles.fullScreenImageContainer,
                        { transform: position.getTranslateTransform() },
                     ]}
                     {...panResponder.panHandlers}>
                     <Image
                        transition={300}
                        contentFit="contain"
                        source={{ uri: photos[selectedIndex].uri }}
                        style={styles.fullScreenImage}
                     />
                     <TouchableOpacity style={styles.leftArrow} onPress={handlePrev}>
                        <Feather name="chevron-left" size={28} color={'white'} />
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.rightArrow} onPress={handleNext}>
                        <Feather name="chevron-right" size={28} color={'white'} />
                     </TouchableOpacity>
                  </Animated.View>
               </View>
            </Modal>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginBottom: 20,
   },
   gallery: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
   },
   thumbnail: {
      width: width * 0.45,
      height: width / 3 - 8,
      margin: 4,
      borderRadius: 8,
   },
   fullScreenContainer: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
   },
   fullScreenImageContainer: {
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
   },
   fullScreenImage: {
      width: '100%',
      height: '100%',
   },
   leftArrow: {
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: [{ translateY: -25 }],
      zIndex: 1,
   },
   rightArrow: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -25 }],
      zIndex: 1,
   },
   arrow: {
      width: 50,
      height: 50,
      tintColor: 'white',
   },
});

export default PhotoGallery;
