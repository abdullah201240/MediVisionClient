import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
};

type HeaderProps = {
  userName: string;
  userEmail: string;
  onLogout?: () => void;
  onUserInfoPress?: () => void;
  onSettingsPress?: () => void;
  onBackPress?: () => void; // New prop for back button
  showBackButton?: boolean; // New prop to control back button visibility
  isAdmin?: boolean; // New prop to indicate if user is admin
};

const Header: React.FC<HeaderProps> = ({ userName, userEmail, onLogout, onUserInfoPress, onSettingsPress, onBackPress, showBackButton = false, isAdmin = false }) => {
  const [isUserInfoPressed, setIsUserInfoPressed] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { t, language, setLanguage } = useLanguage();
  const { isDarkMode } = useTheme();

  const handleMenuPress = () => {
    // Show menu options
    const baseActions: Array<{
      text: string;
      onPress: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }> = [
      {
        text: t('settings'),
        onPress: () => {
          console.log('Settings pressed');
          if (onSettingsPress) {
            onSettingsPress();
          } else {
            console.log('No onSettingsPress handler provided');
          }
        },
      },
      {
        text: t('changeLanguage'),
        onPress: () => {
          // Toggle language directly
          const newLanguage = language === 'en' ? 'bn' : 'en';
          setLanguage(newLanguage);
        },
      },
      {
        text: t('helpSupport'),
        onPress: () => console.log('Help pressed'),
      },
      {
        text: t('cancel'),
        onPress: () => {},
        style: 'cancel',
      },
    ];

    // Add admin-specific options if user is admin
    const adminActions = isAdmin ? [
      {
        text: 'Admin Dashboard',
        onPress: () => {
          if (onUserInfoPress) {
            onUserInfoPress();
          }
        },
      },
      ...baseActions
    ] : baseActions;

    showAlert({
      title: t('menuOptions'),
      message: t('selectAnOption'),
      type: 'info',
      actions: adminActions
    });
  };

  const handleLanguageChange = () => {
    // Toggle between English and Bangla
    const newLanguage = language === 'en' ? 'bn' : 'en';
    setLanguage(newLanguage);
  };

  const handleLogoutPress = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    
    // Show confirmation dialog
    showAlert({
      title: t('logout'),
      message: t('areYouSureLogout'),
      type: 'warning',
      actions: [
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: () => {
            // Navigate to main screen
            navigation.navigate('Main');
          },
        },
      ]
    });
  };

  return (
    <View style={[styles.header, isDarkMode && styles.darkHeader, { paddingTop: insets.top }]}>
      {showBackButton ? (
        <TouchableOpacity style={[styles.menuButton, isDarkMode && styles.darkMenuButton]} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.menuButton, isDarkMode && styles.darkMenuButton]} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[
          styles.userInfo,
          isUserInfoPressed && (isDarkMode ? styles.darkUserInfoPressed : styles.userInfoPressed)
        ]} 
        onPress={onUserInfoPress}
        onPressIn={() => setIsUserInfoPressed(true)}
        onPressOut={() => setIsUserInfoPressed(false)}
      >
        <Text style={[styles.userName, isDarkMode && styles.darkUserName]} numberOfLines={1}>{userName}</Text>
        <Text style={[styles.userEmail, isDarkMode && styles.darkUserEmail]} numberOfLines={1}>{userEmail}</Text>
      </TouchableOpacity>
      
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={handleLanguageChange}>
          <BlurView intensity={80} style={[styles.languageButton, isDarkMode && styles.darkLanguageButton]} tint={isDarkMode ? "dark" : "light"}>
            <Text style={[styles.languageButtonText, isDarkMode && styles.darkLanguageButtonText]}>
              {language === 'bn' ? 'EN' : 'বাংলা'}
            </Text>
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={handleLogoutPress}>
          <Ionicons name="power" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkMenuButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  userInfo: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: 8,
  },
  userInfoPressed: {
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkUserInfoPressed: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    maxWidth: 150,
  },
  darkUserName: {
    color: '#e2e8f0',
  },
  userEmail: {
    fontSize: 12,
    color: '#718096',
    maxWidth: 150,
  },
  darkUserEmail: {
    color: '#94a3b8',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'rgba(0, 131, 90, 0.2)',
    borderWidth: 1,
  },
  darkLanguageButton: {
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  languageButtonText: {
    color: '#00835A',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  darkLanguageButtonText: {
    color: '#4ade80',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkLogoutButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
});

export default Header;