import React from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ScanContent from './ScanScreen';
import { useTheme } from '../context/ThemeContext';

const ScanScreenWrapper = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'} />
      <Header 
        userName="Muhtadi Ridwan"
        userEmail="muhtadiiridwan5@gmail.com"
      />
      <ScanContent />
      <BottomNavigation activeTab="scan" />
    </View>
  );
};

export default ScanScreenWrapper;