// ConfettiComponent.tsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export interface ConfettiComponentRef {
   triggerConfetti: () => void;
}

const ConfettiComponent = forwardRef<ConfettiComponentRef>((props, ref) => {
   const confettiRef = useRef<ConfettiCannon>(null);
   const [showConfetti, setShowConfetti] = useState(false);

   useImperativeHandle(ref, () => ({
      triggerConfetti: () => {
         setShowConfetti(true);
         setTimeout(() => {
            setShowConfetti(false);
         }, 3000);
      },
   }));

   return (
      <Modal
         transparent
         visible={showConfetti}
         animationType="fade"
         onRequestClose={() => setShowConfetti(false)}>
         <View style={styles.modalContainer}>
            <ConfettiCannon ref={confettiRef} count={250} origin={{ x: -10, y: 0 }} fadeOut />
         </View>
      </Modal>
   );
});

const styles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Optional: to dim the background
   },
});

export default ConfettiComponent;
