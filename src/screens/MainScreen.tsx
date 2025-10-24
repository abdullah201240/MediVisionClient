import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/footer';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface MainScreenProps {
  navigation: MainScreenNavigationProp;
};

const MainScreen = ({ navigation }: MainScreenProps) => {
  const { t, language, setIsLanguageSelected, setLanguage } = useLanguage();

  const handleBackToLanguageSelection = () => {
    setIsLanguageSelected(false);
  };

  const handleLanguageChange = () => {
    // Toggle between English and Bangla
    const newLanguage = language === 'en' ? 'bn' : 'en';
    setLanguage(newLanguage);
  };

  const handleLogin = () => {
    // Handle login navigation
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    // Handle signup navigation
    navigation.navigate('Signup');
  };

  const handleContinue = () => {
    // Navigate to main tabs screen
    navigation.navigate('MainTabs');
  };

  return (
    <LinearGradient
      colors={['#0a2f24', '#0D3B2E', '#1a5e48', '#0D3B2E', '#0a2f24']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Language Change Button */}
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={handleLanguageChange}
      >
        <Text style={styles.languageButtonText}>
          {language === 'bn' ? 'EN' : 'বাংলা'}
        </Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo/Brand Area */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <Text style={styles.logoText}>M</Text>
              </LinearGradient>
            </View>
            <Text style={styles.brandName}>MediVision</Text>
            
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>
              {t('welcome')}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {language === 'bn' ? t('pocketHealthcareBn') : t('pocketHealthcare')}
            </Text>
          </View>

          {/* Auth Buttons */}
          <View style={styles.authContainer}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f0f0f0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>
                  {language === 'bn' ? 'লগইন' : 'Login'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signupButton}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.signupButtonText}>
                  {language === 'bn' ? 'একাউন্ট তৈরি করুন' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Continue button to go directly to main tabs */}
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00b374', '#00835a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {t('continue')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Footer positioned at the bottom */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  languageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    right: width * 0.06,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 20,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  languageButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.05,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
    width: '100%',
  },
  logoCircle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: height * 0.02,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoText: {
    fontSize: Math.min(width * 0.15, 56),
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  brandName: {
    fontSize: Math.min(width * 0.09, 36),
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1.5,
    marginBottom: height * 0.005,
  },
  tagline: {
    fontSize: Math.min(width * 0.04, 16),
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: height * 0.06,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: Math.min(width * 0.085, 34),
    fontWeight: '800',
    color: 'white',
    marginBottom: height * 0.015,
    textAlign: 'center',
    lineHeight: Math.min(width * 0.1, 40),
  },
  welcomeSubtitle: {
    fontSize: Math.min(width * 0.045, 18),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Math.min(width * 0.065, 26),
    paddingHorizontal: width * 0.05,
    fontWeight: '500',
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: height * 0.04,
  },
  loginButton: {
    width: '100%',
    marginBottom: height * 0.025,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  signupButton: {
    width: '100%',
    marginBottom: height * 0.025,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButton: {
    width: '100%',
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
  buttonGradient: {
    paddingVertical: height * 0.022,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: Math.min(width * 0.048, 19),
    fontWeight: '700',
    color: '#0D3B2E',
    letterSpacing: 0.5,
  },
  signupButtonText: {
    fontSize: Math.min(width * 0.048, 19),
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  continueButtonText: {
    fontSize: Math.min(width * 0.048, 19),
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
});

export default MainScreen;