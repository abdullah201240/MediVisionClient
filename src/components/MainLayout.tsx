import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'scan' | 'history' | 'profile';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab }) => {
  return (
    <View style={styles.container}>
      <Header 
        userName="Muhtadi Ridwan"
        userEmail="muhtadiiridwan5@gmail.com"
      />
      <View style={styles.content}>
        {children}
      </View>
      <BottomNavigation activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default MainLayout;