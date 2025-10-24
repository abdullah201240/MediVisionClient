import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLanguage } from './src/context/LanguageContext';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MainTabsScreen from './src/screens/MainTabsScreen';
import Footer from './src/components/footer';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  LanguageSelection: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

type LanguageSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LanguageSelection'>;

const LanguageSelectionScreen = () => {
  const { setLanguage, t, isLanguageSelected, setIsLanguageSelected } = useLanguage();
  const navigation = useNavigation<LanguageSelectionScreenNavigationProp>();

  const handleLanguageSelect = (selectedLanguage: 'en' | 'bn') => {
    setLanguage(selectedLanguage);
    setIsLanguageSelected(true);
  };

  // Navigate to main app when language is selected
  useEffect(() => {
    if (isLanguageSelected) {
      // Force navigation to main app
      navigation.navigate('Main');
    }
  }, [isLanguageSelected, navigation]);

  return (
    <LinearGradient
      colors={['#0a2f24', '#0D3B2E', '#1a5e48', '#0D3B2E', '#0a2f24']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.headerSection}>
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
          <Text style={styles.title}>MediVision</Text>
        </View>

        {/* Language Selection Section */}
        <View style={styles.selectionSection}>
          <Text style={styles.subtitle}>{t('languageSelection')}</Text>
          <Text style={styles.description}>{t('languageDescription')}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => handleLanguageSelect('bn')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f0f0f0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banglaButton}
              >
                <Text style={styles.flagEmoji}>🇧🇩</Text>
                <Text style={styles.banglaButtonText}>
                  বাংলা
                </Text>
                <Text style={styles.buttonSubtext}>{t('bangla')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => handleLanguageSelect('en')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.englishButton}
              >
                <Text style={styles.flagEmoji}>🇬🇧</Text>
                <Text style={styles.englishButtonText}>
                  English
                </Text>
                <Text style={[styles.buttonSubtext, { color: 'rgba(255,255,255,0.8)' }]}>
                  {t('english')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Footer Section */}
        <View style={styles.footerContainer}>
          <Footer />
        </View>
      </View>
    </LinearGradient>
  );
};

const AppWithProviders = () => {
  const { isLanguageSelected } = useLanguage();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLanguageSelected ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="MainTabs" component={MainTabsScreen} />
          </>
        ) : (
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AppWithProviders />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    paddingTop: Platform.OS === 'ios' ? height * 0.08 : height * 0.06,
    paddingBottom: Platform.OS === 'ios' ? height * 0.05 : height * 0.03,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  logoCircle: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: height * 0.025,
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
  title: {
    fontSize: Math.min(width * 0.13, 52),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: height * 0.01,
    letterSpacing: 1,
  },
  selectionSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: -height * 0.01,
  },
  subtitle: {
    fontSize: Math.min(width * 0.065, 26),
    color: 'white',
    marginBottom: height * 0.01,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: Math.min(width * 0.038, 15),
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: height * 0.02,
  },
  buttonWrapper: {
    width: '100%',
  },
  banglaButton: {
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.06,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  englishButton: {
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.06,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  flagEmoji: {
    fontSize: width * 0.08,
    marginBottom: height * 0.008,
  },
  banglaButtonText: {
    color: '#0D3B2E',
    fontSize: Math.min(width * 0.055, 22),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  englishButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.055, 22),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  buttonSubtext: {
    color: 'rgba(13, 59, 46, 0.6)',
    fontSize: Math.min(width * 0.032, 13),
    fontWeight: '500',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    paddingTop: height * 0.02,
    width: '100%',
  },
});

export default App;