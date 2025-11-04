import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';

type SettingsScreenProps = {
  onBackPress?: () => void;
  onAboutPress?: () => void;
  onHelpSupportPress?: () => void;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBackPress, onAboutPress, onHelpSupportPress }) => {
  const { t, language, setLanguage } = useLanguage();
  const { showAlert } = useAlert();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // State for various settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'বাংলা' },
  ];
  
  const handleLanguageChange = (selectedLanguage: 'en' | 'bn') => {
    setLanguage(selectedLanguage);
    showAlert({
      title: t('success'),
      message: `${t('language')} ${selectedLanguage === 'en' ? 'English' : 'বাংলা'} ${t('updated')}`,
      type: 'success'
    });
  };
  
  const handleDarkModeToggle = (value: boolean) => {
    toggleTheme();
    showAlert({
      title: t('success'),
      message: `${t('darkMode')} ${value ? t('enabled') : t('disabled')}`,
      type: 'success'
    });
  };
  
  const handleBiometricToggle = (value: boolean) => {
    setBiometricEnabled(value);
    showAlert({
      title: t('success'),
      message: `${t('biometricAuth')} ${value ? t('enabled') : t('disabled')}`,
      type: 'success'
    });
  };
  
  const handleChangePassword = () => {
    showAlert({
      title: t('changePassword'),
      message: t('passwordChangeInstructions') || 'Password change functionality would be implemented here.',
      type: 'info',
      actions: [
        {
          text: t('ok'),
          onPress: () => console.log('Password change initiated')
        }
      ]
    });
  };
  
  const handleEditProfile = () => {
    showAlert({
      title: t('editProfile'),
      message: t('profileEditInstructions') || 'Profile edit functionality would be implemented here.',
      type: 'info',
      actions: [
        {
          text: t('ok'),
          onPress: () => console.log('Profile edit initiated')
        }
      ]
    });
  };
  
  const handleChangeEmail = () => {
    showAlert({
      title: t('changeEmail'),
      message: t('emailChangeInstructions') || 'Email change functionality would be implemented here.',
      type: 'info',
      actions: [
        {
          text: t('ok'),
          onPress: () => console.log('Email change initiated')
        }
      ]
    });
  };
  
  const handleHelpSupport = () => {
    // Navigate to Help & Support page
    if (onHelpSupportPress) {
      onHelpSupportPress();
    } else {
      showAlert({
        title: t('helpSupport'),
        message: t('supportInstructions') || 'Help and support functionality would be implemented here.',
        type: 'info'
      });
    }
  };
  
  const handleAbout = () => {
    // Navigate to About page
    if (onAboutPress) {
      onAboutPress();
    } else {
      showAlert({
        title: t('about'),
        message: t('appDescription') || 'App description would be shown here.',
        type: 'info'
      });
    }
  };
  
  const handleRateApp = async () => {
    // Try to open the app store rating page
    try {
      const iosAppId = '1234567890'; // Replace with your iOS App Store ID
      const androidPackageName = 'com.yourcompany.medivision'; // Replace with your Android package name
      
      let url = '';
      
      if (Platform.OS === 'ios') {
        // App Store URL format: itms-apps://itunes.apple.com/app/id{APP_ID}
        url = `itms-apps://itunes.apple.com/app/id${iosAppId}`;
      } else if (Platform.OS === 'android') {
        // Play Store URL format: market://details?id={PACKAGE_NAME}
        url = `market://details?id=${androidPackageName}`;
      }
      
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to web URLs if the app-specific URLs don't work
        let webUrl = '';
        if (Platform.OS === 'ios') {
          webUrl = `https://apps.apple.com/app/id${iosAppId}`;
        } else if (Platform.OS === 'android') {
          webUrl = `https://play.google.com/store/apps/details?id=${androidPackageName}`;
        }
        
        const webSupported = await Linking.canOpenURL(webUrl);
        if (webSupported) {
          await Linking.openURL(webUrl);
        } else {
          // Show an alert if neither method works
          showAlert({
            title: t('rateApp'),
            message: t('rateAppError') || 'Unable to open the app store. Please search for the app in your device\'s app store.',
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error opening app store:', error);
      showAlert({
        title: t('rateApp'),
        message: t('rateAppError') || 'Unable to open the app store. Please search for the app in your device\'s app store.',
        type: 'error'
      });
    }
  };
  
  const handleDeleteAccount = () => {
    showAlert({
      title: t('deleteAccount'),
      message: t('deleteAccountWarning') || 'Are you sure you want to delete your account? This action cannot be undone.',
      type: 'warning',
      actions: [
        {
          text: t('cancel'),
          style: 'cancel',
          onPress: () => console.log('Account deletion cancelled')
        },
        {
          text: t('deleteAccount'),
          style: 'destructive',
          onPress: () => {
            showAlert({
              title: t('success'),
              message: t('accountDeleted') || 'Your account has been successfully deleted.',
              type: 'success'
            });
          }
        }
      ]
    });
  };
  
  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{title}</Text>
      <View style={[styles.sectionContent, isDarkMode && styles.darkSectionContent]}>
        {children}
      </View>
    </View>
  );
  
  const renderSettingItem = (
    icon: string, 
    title: string, 
    subtitle?: string, 
    onPress?: () => void,
    rightComponent?: React.ReactNode,
    iconColor: string = isDarkMode ? "#4ade80" : "#00835A"
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, isDarkMode && styles.darkSettingItem]}
      onPress={onPress}
    >
      <View style={[styles.settingIcon, isDarkMode && styles.darkSettingIcon]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, isDarkMode && styles.darkSettingTitle]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, isDarkMode && styles.darkSettingSubtitle]}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Removed header with back button and title */}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Settings */}
        {renderSection(t('language'), 
          <View style={styles.languageContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  isDarkMode && styles.darkLanguageOption,
                  language === lang.code && (isDarkMode ? styles.darkSelectedLanguage : styles.selectedLanguage)
                ]}
                onPress={() => handleLanguageChange(lang.code as 'en' | 'bn')}
              >
                <Text style={[
                  styles.languageText,
                  isDarkMode && styles.darkLanguageText,
                  language === lang.code && (isDarkMode ? styles.darkSelectedLanguageText : styles.selectedLanguageText)
                ]}>
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color={isDarkMode ? "#4ade80" : "#00835A"} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Notification Settings */}
        {renderSection(t('notifications'), 
          renderSettingItem(
            'notifications',
            t('enableNotifications'),
            t('receiveAppNotifications'),
            undefined,
            <Switch
              trackColor={{ false: isDarkMode ? '#4b5563' : '#767577', true: isDarkMode ? '#4ade80' : '#81b0ff' }}
              thumbColor={notificationsEnabled ? (isDarkMode ? '#4ade80' : '#00835A') : (isDarkMode ? '#94a3b8' : '#f4f3f4')}
              ios_backgroundColor={isDarkMode ? "#374151" : "#3e3e3e"}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          )
        )}
        
        {/* Appearance Settings */}
        {renderSection(t('appearance'), 
          renderSettingItem(
            'moon',
            t('darkMode'),
            t('enableDarkTheme'),
            undefined,
            <Switch
              trackColor={{ false: isDarkMode ? '#4b5563' : '#767577', true: isDarkMode ? '#4ade80' : '#81b0ff' }}
              thumbColor={isDarkMode ? '#4ade80' : '#00835A'}
              ios_backgroundColor={isDarkMode ? "#374151" : "#3e3e3e"}
              onValueChange={handleDarkModeToggle}
              value={isDarkMode}
            />
          )
        )}
        
       
        
        {/* Account Settings */}
        {renderSection(t('account'), 
          <>
            {renderSettingItem(
              'person',
              t('editProfile'),
              t('updateProfileInfo'),
              handleEditProfile
            )}
            {renderSettingItem(
              'mail',
              t('changeEmail'),
              t('updateEmailAddress'),
              handleChangeEmail
            )}
          </>
        )}
        
        {/* Support Settings */}
        {renderSection(t('support'), 
          <>
            {renderSettingItem(
              'help-buoy',
              t('helpSupport'),
              t('getHelpWithApp'),
              handleHelpSupport
            )}
            {renderSettingItem(
              'information-circle',
              t('about'),
              t('aboutThisApp'),
              handleAbout
            )}
            
          </>
        )}
        
        {/* Danger Zone */}
        {renderSection(t('dangerZone'), 
          renderSettingItem(
            'trash',
            t('deleteAccount'),
            t('permanentlyDeleteAccount'),
            handleDeleteAccount,
            undefined,
            isDarkMode ? '#f87171' : '#FF0000'
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  // Removed header styles
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16, // Add some padding at the top
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  darkSectionTitle: {
    color: '#94a3b8',
  },
  sectionContent: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkSectionContent: {
    backgroundColor: '#2d3748',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 131, 90, 0.05)',
  },
  darkSettingItem: {
    borderBottomColor: 'rgba(74, 222, 128, 0.1)',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  darkSettingIcon: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 2,
  },
  darkSettingTitle: {
    color: '#e2e8f0',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  darkSettingSubtitle: {
    color: '#94a3b8',
  },
  languageContainer: {
    padding: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 131, 90, 0.05)',
  },
  darkLanguageOption: {
    borderBottomColor: 'rgba(74, 222, 128, 0.1)',
  },
  selectedLanguage: {
    backgroundColor: 'rgba(0, 131, 90, 0.05)',
  },
  darkSelectedLanguage: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  languageText: {
    fontSize: 16,
    color: '#4a5568',
  },
  darkLanguageText: {
    color: '#cbd5e1',
  },
  selectedLanguageText: {
    fontWeight: '600',
    color: '#00835A',
  },
  darkSelectedLanguageText: {
    fontWeight: '600',
    color: '#4ade80',
  },
});

export default SettingsScreen;