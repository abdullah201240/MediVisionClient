import React from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import AdminProfileScreen from './AdminProfileScreen';
import { useTheme } from '../context/ThemeContext';

const AdminProfileScreenWrapper = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'} />
      <Header 
        userName="System Admin"
        userEmail="admin@midivision.com"
        isAdmin={true}
      />
      <AdminProfileScreen />
      <BottomNavigation activeTab="profile" />
    </View>
  );
};

export default AdminProfileScreenWrapper;