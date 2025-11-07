import React, { useState, useRef, RefObject } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { api } from '../lib/api';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef<Array<RefObject<TextInput>>>([]);

  // Initialize refs for each OTP input
  if (otpInputs.current.length !== 4) {
    otpInputs.current = Array(4).fill(null).map(() => React.createRef<TextInput>()) as Array<RefObject<TextInput>>;
  }

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert(t('error'), t('enterEmail'));
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.sendOtp(email);
      
      if (response.error) {
        Alert.alert(t('error'), response.error);
        setIsLoading(false);
        return;
      }
      
      setShowOtpInput(true);
      setIsLoading(false);
      Alert.alert(t('success'), t('otpSentSuccessfully'));
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert(t('error'), t('failedToSendOtp') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(text)) return;
    
    const newOtp = otp.split('');
    newOtp[index] = text;
    const newOtpString = newOtp.join('').substring(0, 4);
    setOtp(newOtpString);
    
    // Move to next input if a digit was entered and it's not the last input
    if (text && index < 3) {
      otpInputs.current[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].current?.focus();
    }
  };

  const handleLogin = async () => {
    if (otp.length !== 4) {
      Alert.alert(t('error'), t('enter4DigitOtp'));
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.verifyOtp(email, otp);
      
      if (response.error) {
        Alert.alert(t('error'), response.error);
        setIsLoading(false);
        return;
      }
      
      // Save the auth token
      if (response.data?.access_token) {
        await api.setAuthToken(response.data.access_token);
      }
      
      setIsLoading(false);
      // Navigate to main tabs screen
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t('error'), t('failedToLogin') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Instead of going back, navigate to Main screen to avoid circular navigation
    navigation.navigate('Main');
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <LinearGradient
        colors={['#0a2f24', '#0D3B2E', '#1a5e48', '#0D3B2E', '#0a2f24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>
            {language === 'bn' ? '← ফিরে যান' : '← Back'}
          </Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Logo/Brand Area */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <Text style={styles.logoText}>M</Text>
              </LinearGradient>
            </View>
            <Text style={styles.brandName}>MediVision</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {t('login')}
            </Text>
            
            {!showOtpInput ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('email')}
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="done"
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.sendOtpButton}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f0f0f0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.sendOtpButtonText}>
                      {isLoading ? t('sending') : t('sendOtp')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.otpInstruction}>
                  {t('enterOtpSent')}
                </Text>
                
                <View style={styles.otpContainer}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <TextInput
                      key={index}
                      ref={otpInputs.current[index]}
                      style={[
                        styles.otpInput,
                        index === otp.length && styles.activeOtpInput
                      ]}
                      value={otp[index] || ''}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      selectTextOnFocus
                      autoFocus={index === 0 && showOtpInput}
                    />
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f0f0f0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? t('loggingIn') : t('login')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.resendOtpButton}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.resendOtpText}>
                    {t('resendOtp')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    left: width * 0.06,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: height * 0.06,
  },
  logoCircle: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    marginBottom: height * 0.025,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.125,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: 'bold',
    color: 'white',
  },
  brandName: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  input: {
    width: '100%',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    color: 'white',
    fontSize: Math.min(width * 0.04, 16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendOtpButton: {
    width: '100%',
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: height * 0.02,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOtpButtonText: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#0D3B2E',
  },
  otpInstruction: {
    fontSize: Math.min(width * 0.04, 16),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: height * 0.03,
    lineHeight: Math.min(width * 0.055, 22),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: height * 0.03,
    alignSelf: 'center',
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeOtpInput: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  loginButton: {
    width: '100%',
    marginTop: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#0D3B2E',
  },
  resendOtpButton: {
    marginTop: height * 0.02,
  },
  resendOtpText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Math.min(width * 0.035, 14),
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;