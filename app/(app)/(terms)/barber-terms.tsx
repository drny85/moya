import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import Constants from 'expo-constants';
import { BackButton } from '~/components/BackButton';
import { router } from 'expo-router';

const BarberTermsOfUse: React.FC = () => {
   return (
      <Container>
         <BackButton onPress={() => router.back()} />
         <ScrollView className="flex-1 bg-background p-2" contentContainerClassName="mb-4">
            <Text style={styles.title}>Terms of Use</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
               Welcome to {Constants.expoConfig?.name}! By using our platform, you agree to comply
               with and be bound by the following terms of use. Please read them carefully.
            </Text>

            <Text style={styles.sectionTitle}>2. Barber Responsibilities</Text>
            <Text style={styles.text}>
               As a barber, you are responsible for providing professional and courteous services to
               your clients. You agree to honor all bookings made through our app and to maintain
               the highest standards of hygiene and safety.
            </Text>

            <Text style={styles.sectionTitle}>3. Booking and Cancellation</Text>
            <Text style={styles.text}>
               You must manage your availability accurately in the app. Any cancellations should be
               done in a timely manner, and you must notify your clients immediately if you are
               unable to fulfill a booking.
            </Text>

            <Text style={styles.sectionTitle}>4. Payment and Fees</Text>
            <Text style={styles.text}>
               Payments for services rendered will be processed through our platform. A service fee
               may be deducted from each transaction. You agree to the fee structure outlined by
               [App Name].
            </Text>

            <Text style={styles.sectionTitle}>5. Prohibited Conduct</Text>
            <Text style={styles.text}>
               You agree not to engage in any unlawful, fraudulent, or harmful activities. Any
               behavior that violates our policies or harms the reputation of [App Name] or its
               users will result in account termination.
            </Text>

            <Text style={styles.sectionTitle}>6. Account Termination</Text>
            <Text style={styles.text}>
               We reserve the right to terminate your account at any time if you fail to comply with
               these terms or engage in behavior detrimental to the platform or its users.
            </Text>

            <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
            <Text style={styles.text}>
               We may update these terms from time to time. You will be notified of any significant
               changes, and continued use of the app constitutes your acceptance of the new terms.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.text}>
               If you have any questions about these terms, please contact us at
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
      backgroundColor: '#fff',
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

export default BarberTermsOfUse;
