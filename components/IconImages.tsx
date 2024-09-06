import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ICON_IMAGES } from '~/constants';
import { IconNames } from '~/shared/types';

// Define the type for IconImageType
type IconImageType = {
   [key: string]: any;
};

type IconImagesProps = {
   icons: IconImageType;
   selected: IconNames | null;
   onSelectIcon: (selectedIconKey: IconNames) => void;
};

const IconImages: React.FC<IconImagesProps> = ({ icons, onSelectIcon, selected }) => {
   const [selectedIcon, setSelectedIcon] = useState<IconNames | null>(selected);
   const [index, setIndex] = useState(0);
   const ref = useRef<FlatList>(null);
   const handleSelectIcon = (iconKey: IconNames) => {
      setSelectedIcon(iconKey);
      onSelectIcon(iconKey);
   };

   useEffect(() => {
      ref.current?.scrollToIndex({
         index,
         viewOffset: 10,
         viewPosition: 0.5,
         animated: true,
      });
   }, [index]);

   return (
      <FlatList
         horizontal
         data={Object.keys(ICON_IMAGES)}
         ref={ref}
         initialScrollIndex={index}
         onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
               ref.current?.scrollToIndex({ index: info.index, animated: true });
            });
         }}
         showsHorizontalScrollIndicator={false}
         style={styles.scrollView}
         renderItem={({ item: iconKey }) => {
            return (
               <TouchableOpacity
                  onPress={() => {
                     setIndex(Object.keys(ICON_IMAGES).indexOf(iconKey));
                     handleSelectIcon(iconKey);
                  }}
                  style={[styles.iconContainer, selectedIcon === iconKey && styles.selectedIcon]}>
                  <Image source={icons[iconKey]} style={styles.icon} />
               </TouchableOpacity>
            );
         }}
      />
   );
};

const styles = StyleSheet.create({
   scrollView: {
      paddingVertical: 10,
   },
   iconContainer: {
      alignItems: 'center',
      marginHorizontal: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
   },
   selectedIcon: {
      backgroundColor: '#c0c0c0',
   },
   icon: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
   },
   iconLabel: {
      marginTop: 5,
      fontSize: 12,
      color: '#333',
   },
});

export default IconImages;
