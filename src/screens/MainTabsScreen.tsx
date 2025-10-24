import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import DashboardContent from './DashboardScreen';
import ScanContent from './ScanScreen';
import HistoryContent from './HistoryScreen';
import ProfileContent from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import AboutScreen from './AboutScreen';
import HelpSupportScreen from './HelpSupportScreen';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';

type NavigationMode = 'home' | 'scan' | 'history' | 'profile';
type MainTabMode = NavigationMode | 'settings' | 'privacyPolicy' | 'about' | 'helpSupport';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  LanguageSelection: undefined;
};

const MainTabsScreen = () => {
  const [activeTab, setActiveTab] = useState<MainTabMode>('home');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showAlert } = useAlert();
  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    // Navigate back to the main screen
    navigation.navigate('Main');
  };

  const handleBackPress = () => {
    // Navigate back to profile when on special pages
    setActiveTab('profile');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardContent 
          onScanPress={() => {
            console.log('Scan button pressed in MainTabsScreen');
            setActiveTab('scan');
          }} 
          onHistoryPress={() => {
            console.log('History button pressed in MainTabsScreen');
            setActiveTab('history');
          }} 
        />;
      case 'scan':
        return <ScanContent />;
      case 'history':
        return <HistoryContent />;
      case 'profile':
        return <ProfileContent 
          onSettingsPress={() => setActiveTab('settings')} 
          onPrivacyPolicyPress={() => setActiveTab('privacyPolicy')} 
          onAboutPress={() => setActiveTab('about')} 
          onHelpSupportPress={() => setActiveTab('helpSupport')} 
        />;
      case 'settings':
        return <SettingsScreen 
          onBackPress={() => setActiveTab('profile')} 
          onAboutPress={() => setActiveTab('about')}
          onHelpSupportPress={() => setActiveTab('helpSupport')}
        />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onBackPress={() => setActiveTab('profile')} />;
      case 'about':
        return <AboutScreen onBackPress={() => setActiveTab('profile')} />;
      case 'helpSupport':
        return <HelpSupportScreen onBackPress={() => setActiveTab('profile')} />;
      default:
        return <DashboardContent 
          onScanPress={() => {
            console.log('Scan button pressed in MainTabsScreen (default)');
            setActiveTab('scan');
          }} 
          onHistoryPress={() => {
            console.log('History button pressed in MainTabsScreen (default)');
            setActiveTab('history');
          }} 
        />;
    }
  };

  // Check if current tab should hide bottom navigation
  const shouldHideBottomNavigation = () => {
    // Show bottom navigation for all pages including settings, privacy policy, about, and help support
    return false;
  };

  // Check if current tab should show back button
  const shouldShowBackButton = () => {
    return activeTab === 'settings' || activeTab === 'privacyPolicy' || activeTab === 'about' || activeTab === 'helpSupport';
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'} />
      <Header 
        userName="Muhtadi Ridwan"
        userEmail="muhtadiiridwan5@gmail.com"
        onLogout={handleLogout}
        onUserInfoPress={() => {
          console.log('User info pressed, navigating to profile');
          setActiveTab('profile');
        }}
        onSettingsPress={() => {
          console.log('Settings pressed, navigating to settings');
          setActiveTab('settings');
        }}
        showBackButton={shouldShowBackButton()}
        onBackPress={handleBackPress}
      />
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      <BottomNavigation 
        activeTab={activeTab as NavigationMode} 
        onTabChange={(tab: NavigationMode) => setActiveTab(tab)} 
      />
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
  content: {
    flex: 1,
    paddingBottom: 80, // Add padding to account for bottom navigation height
  },
});

export default MainTabsScreen;