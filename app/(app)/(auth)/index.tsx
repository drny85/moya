import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginForm from '~/components/Forms/LoginForm';
import SignupForm from '~/components/Forms/SignupForm';
import KeyboardScreen from '~/components/KeyboardScreen';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useAuth } from '~/providers/AuthContext';

type Props = {
   mode: 'login' | 'register';
};
const LoginScreen = () => {
   const [isSignUp, setIsSignUp] = useState(false);
   const { loading } = useAuth();
   const { mode } = useLocalSearchParams<Props>();
   useEffect(() => {
      if (mode === 'register') setIsSignUp(true);
   }, [mode]);

   if (loading) return <ActivityIndicator />;

   return (
      <KeyboardScreen style={styles.container}>
         <Text style={styles.welcomeText}>Welcome</Text>
         <View style={styles.authSwitch}>
            <TouchableOpacity
               onPress={() => setIsSignUp(false)}
               style={!isSignUp ? styles.activeTab : styles.inactiveTab}>
               <Text style={!isSignUp ? styles.activeTabText : styles.inactiveTabText}>
                  Sign in
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setIsSignUp(true)}
               style={isSignUp ? styles.activeTab : styles.inactiveTab}>
               <Text style={isSignUp ? styles.activeTabText : styles.inactiveTabText}>Sign up</Text>
            </TouchableOpacity>
         </View>

         {isSignUp ? <SignupForm /> : <LoginForm />}
      </KeyboardScreen>
   );
};

export default LoginScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,

      justifyContent: 'center',
      paddingHorizontal: 30,
      backgroundColor: '#FFF',
   },
   welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
   },
   authSwitch: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
   },
   activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#000',
      paddingBottom: 10,
      marginRight: 20,
   },
   inactiveTab: {
      paddingBottom: 10,
      marginRight: 20,
   },
   activeTabText: {
      fontWeight: 'bold',
      fontSize: 16,
   },
   inactiveTabText: {
      color: '#888',
      fontSize: 16,
   },
   input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 15,
      marginBottom: 20,
   },
   signInButton: {
      backgroundColor: '#F9A825',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
   },
   signInButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
   },
   orText: {
      textAlign: 'center',
      color: '#888',
      marginBottom: 20,
   },
   socialLoginContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   socialButton: {
      flex: 1,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#4285F4',
      alignItems: 'center',
      marginHorizontal: 5,
   },
   socialButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
   },
});
