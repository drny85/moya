import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container } from '~/components/Container';
import Constants from 'expo-constants';
import { BackButton } from '~/components/BackButton';
import { router } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';

const CustomerPrivacyPolicy: React.FC = () => {
   return (
      <Container>
         <BackButton onPress={() => router.back()} />
         <ScrollView className="flex-1 bg-background p-2">
            <Text style={styles.title}>Privacy Policy</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
               Welcome to {Constants.expoConfig?.name}! We are committed to protecting your privacy.
               This Privacy Policy explains how we collect, use, and safeguard your personal
               information when you use our app. By accessing or using our services, you agree to
               the terms outlined in this policy.
            </Text>

            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.text}>
               We collect information that you provide directly to us, such as when you create an
               account, book an appointment, or communicate with us. This information may include
               your name, email address, phone number, payment details, and service preferences.
            </Text>

            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.text}>
               We use the information we collect to:
               {'\n'}- Provide and improve our services
               {'\n'}- Process and manage your bookings
               {'\n'}- Communicate with you regarding your appointments
               {'\n'}- Send you updates and promotional offers (you can opt-out at any time)
            </Text>

            <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
            <Text style={styles.text}>
               We do not sell or rent your personal information to third parties. We may share your
               information with service providers who help us operate our app and deliver services
               to you, such as payment processors and customer support teams. We ensure that these
               parties adhere to strict data protection standards.
            </Text>

            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.text}>
               We take data security seriously and implement various measures to protect your
               personal information from unauthorized access, loss, or misuse. However, please note
               that no method of transmitting data over the internet or storing electronic data is
               completely secure.
            </Text>

            <Text style={styles.sectionTitle}>6. Your Rights</Text>
            <Text style={styles.text}>
               You have the right to:
               {'\n'}- Access and update your personal information
               {'\n'}- Request the deletion of your account
               {'\n'}- Opt-out of receiving promotional communications
               {'\n'}- Request information on how your data is being used
            </Text>

            <Text style={styles.sectionTitle}>7. Cookies and Tracking Technologies</Text>
            <Text style={styles.text}>
               We may use cookies and similar tracking technologies to enhance your experience on
               our app. These technologies help us understand how you use our services, personalize
               your experience, and deliver relevant advertisements. You can manage your cookie
               preferences through your device settings.
            </Text>

            <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
            <Text style={styles.text}>
               We may update this Privacy Policy from time to time to reflect changes in our
               practices or for other operational, legal, or regulatory reasons. Any updates will be
               posted on this page, and we will notify you of significant changes.
            </Text>

            <Text style={styles.sectionTitle}>9. Contact Us</Text>
            <Text style={styles.text}>
               If you have any questions or concerns about this Privacy Policy or our data
               practices, please contact us at melendez@robertdev.net.
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

export default CustomerPrivacyPolicy;
