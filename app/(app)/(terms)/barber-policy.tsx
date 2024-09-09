import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Container } from '~/components/Container';
import Constants from 'expo-constants';
import { BackButton } from '~/components/BackButton';
import { router } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';

const PrivacyPolicy: React.FC = () => {
   return (
      <Container>
         <BackButton onPress={() => router.back()} />
         <ScrollView className="flex-1 bg-background p-2">
            <Text style={styles.title}>Privacy Policy</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
               This Privacy Policy outlines how {Constants.expoConfig?.name} collects, uses, and
               protects your personal information. By using our app, you consent to the data
               practices described in this policy.
            </Text>

            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.text}>
               We collect information you provide directly to us, such as when you create an
               account, book a service, or communicate with us. This includes your name, email
               address, phone number, payment information, and service preferences.
            </Text>

            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.text}>
               We use the information we collect to provide, maintain, and improve our services.
               This includes processing bookings, facilitating payments, communicating with you, and
               personalizing your experience.
            </Text>

            <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
            <Text style={styles.text}>
               We do not share your personal information with third parties except as necessary to
               provide our services, comply with legal obligations, or protect our rights. This may
               include sharing information with payment processors or service providers who assist
               us in our operations.
            </Text>

            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.text}>
               We take reasonable measures to protect your personal information from unauthorized
               access, disclosure, alteration, and destruction. However, please be aware that no
               method of transmission over the internet or method of electronic storage is 100%
               secure.
            </Text>

            <Text style={styles.sectionTitle}>6. Your Rights</Text>
            <Text style={styles.text}>
               You have the right to access, update, or delete your personal information. You may
               also opt out of receiving promotional communications from us by following the
               unsubscribe instructions in those communications.
            </Text>

            <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
            <Text style={styles.text}>
               We may update this Privacy Policy from time to time. Any changes will be posted on
               this page, and we will notify you of significant changes. Your continued use of the
               app after any changes constitutes your acceptance of the new policy.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.text}>
               If you have any questions about this Privacy Policy, please contact us at
               melendez@robertdev.net
            </Text>
            <View className="h-10" />
         </ScrollView>
      </Container>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
   },
   text: {
      fontSize: 16,
      lineHeight: 24,
   },
});

export default PrivacyPolicy;
