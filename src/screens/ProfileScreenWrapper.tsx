import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ProfileContent from './ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import { api } from '../lib/api';

const ProfileScreenWrapper = () => {
  const { isDarkMode } = useTheme();
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: 'user@example.com'
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        
        if (response.data) {
          setUserInfo({
            name: response.data.name || 'User',
            email: response.data.email || 'user@example.com'
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'} />
      <Header 
        userName={userInfo.name}
        userEmail={userInfo.email}
      />
      <ProfileContent />
      <BottomNavigation activeTab="profile" />
    </View>
  );
};

export default ProfileScreenWrapper;