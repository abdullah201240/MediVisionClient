import React from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ProfileContent from './ProfileScreen';
import { useTheme } from '../context/ThemeContext';

const ProfileScreenWrapper = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'} />
      <Header 
        userName="Muhtadi Ridwan"
        userEmail="muhtadiiridwan5@gmail.com"
      />
      <ProfileContent />
      <BottomNavigation activeTab="profile" />
    </View>
  );
};

export default ProfileScreenWrapper;