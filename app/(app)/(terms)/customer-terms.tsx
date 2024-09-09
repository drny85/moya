import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BackButton } from '~/components/BackButton';
import { Container } from '~/components/Container';
import Constants from 'expo-constants';
import { Text } from '~/components/nativewindui/Text';

const CustomerTermsOfUse: React.FC = () => {
   return (
      <Container>
         <BackButton onPress={router.back} />
         <ScrollView className="flex-1 bg-background p-2">
            <Text style={styles.title}>Terms of Use</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
               Welcome to {Constants.expoConfig?.name}! By using our app, you agree to comply with
               and be bound by the following terms of use. Please read them carefully before booking
               services through our platform.
            </Text>

            <Text style={styles.sectionTitle}>2. Account Registration</Text>
            <Text style={styles.text}>
               To use our services, you must create an account with accurate and complete
               information. You are responsible for maintaining the confidentiality of your account
               credentials and for all activities that occur under your account.
            </Text>

            <Text style={styles.sectionTitle}>3. Booking Services</Text>
            <Text style={styles.text}>
               Our app allows you to book services with barbers. You agree to provide accurate
               information when making a booking and to arrive on time for your appointment.
               Cancellations or changes to bookings should be made according to the barber's
               cancellation policy.
            </Text>

            <Text style={styles.sectionTitle}>4. Payments</Text>
            <Text style={styles.text}>
               Payments for services booked through our app must be made using the payment methods
               provided. You agree to pay all fees associated with the services you book. Any
               disputes regarding payments must be addressed with the barber directly.
            </Text>

            <Text style={styles.sectionTitle}>5. User Conduct</Text>
            <Text style={styles.text}>
               You agree to use our app in a lawful and respectful manner. Any inappropriate
               behavior, harassment, or misuse of the platform may result in the termination of your
               account.
            </Text>

            <Text style={styles.sectionTitle}>6. Reviews and Feedback</Text>
            <Text style={styles.text}>
               You may leave reviews and feedback for barbers on our platform. Reviews must be
               honest and based on your personal experience. We reserve the right to remove any
               reviews that violate our guidelines or are deemed inappropriate.
            </Text>

            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.text}>
               [App Name] is a platform that connects customers with barbers. We are not responsible
               for the quality of services provided by barbers or any injuries or damages that may
               occur. Your use of the app and the services provided by barbers is at your own risk.
            </Text>

            <Text style={styles.sectionTitle}>8. Termination</Text>
            <Text style={styles.text}>
               We reserve the right to terminate or suspend your account at any time if you violate
               these terms of use or engage in behavior that we deem harmful to the platform or
               other users.
            </Text>

            <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
            <Text style={styles.text}>
               We may update these terms of use from time to time. Any changes will be posted on
               this page, and we will notify you of significant changes. Continued use of the app
               after any changes constitutes your acceptance of the new terms.
            </Text>

            <Text style={styles.sectionTitle}>10. Contact Us</Text>
            <Text style={styles.text}>
               If you have any questions about these terms, please contact us at
               melendez@robertdev.net.
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

export default CustomerTermsOfUse;
