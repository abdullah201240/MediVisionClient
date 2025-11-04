import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import DashboardContent from './DashboardScreen';
import ScanContent from './ScanScreen';
import HistoryContent from './HistoryScreen';
import ProfileContent from './ProfileScreen';
import AdminProfileScreen from './AdminProfileScreen';
import SettingsScreen from './SettingsScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import AboutScreen from './AboutScreen';
import HelpSupportScreen from './HelpSupportScreen';
import MedicineDetailsScreen from './MedicineDetailsScreen';
import UserManagementScreen from './UserManagementScreen';
import MedicineManagementScreen from './MedicineManagementScreen';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../lib/api';

type NavigationMode = 'home' | 'scan' | 'history' | 'profile';
type MainTabMode = NavigationMode | 'settings' | 'privacyPolicy' | 'about' | 'helpSupport' | 'medicineDetails' | 'adminProfile' | 'userManagement' | 'medicineManagement';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  LanguageSelection: undefined;
};

// Sample medicine data - in a real app, this would come from an API or database
const sampleMedicine = {
  id: '1',
  name: 'Napa Extra',
  genericName: 'Paracetamol + Caffeine',
  manufacturer: 'Beximco Pharmaceuticals Ltd.',
  dosage: '500mg + 65mg',
  description: 'Napa Extra is a combination of Paracetamol and Caffeine. Paracetamol is an analgesic (painkiller) and antipyretic (fever reducer). Caffeine is added to enhance the pain-relieving effect of Paracetamol.',
  indications: [
    'Fever',
    'Headache',
    'Migraine',
    'Toothache',
    'Muscle pain',
    'Joint pain',
    'Menstrual pain'
  ],
  contraindications: [
    'Hypersensitivity to paracetamol or caffeine',
    'Severe hepatic impairment',
    'Severe renal impairment',
    'Glucose-6-phosphate dehydrogenase deficiency'
  ],
  sideEffects: [
    'Nausea',
    'Vomiting',
    'Stomach pain',
    'Allergic skin reactions',
    'Liver damage (with overdose)'
  ],
  precautions: [
    'Use with caution in patients with liver disease',
    'Avoid alcohol consumption',
    'Do not exceed recommended dose',
    'Consult doctor if symptoms persist'
  ],
  interactions: [
    'Cholestyramine may reduce absorption',
    'Warfarin interaction may increase bleeding risk',
    'Alcohol may increase liver toxicity'
  ],
  storage: 'Store in a cool, dry place away from direct sunlight. Keep out of reach of children.'
};

const MainTabsScreen = () => {
  const [activeTab, setActiveTab] = useState<MainTabMode>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: 'user@example.com'
  });
  const [selectedMedicine, setSelectedMedicine] = useState<any>(sampleMedicine);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { showAlert } = useAlert();
  const { isDarkMode } = useTheme();

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
          
          // Check if user is admin
          setIsAdmin(response.data.role === 'admin');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    
    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Clear auth token and navigate back to the main screen
    api.clearAuthToken();
    navigation.navigate('Main');
  };

  const handleBackPress = () => {
    // Navigate back to profile when on special pages
    setActiveTab('profile');
  };

  const handleMedicineSelect = (medicine: any) => {
    setSelectedMedicine(medicine);
    setActiveTab('medicineDetails');
  };

  const handleMedicineScan = (medicineData: any) => {
    setSelectedMedicine(medicineData);
    setActiveTab('medicineDetails');
  };

  const handleMedicineUpload = (medicineData: any) => {
    setSelectedMedicine(medicineData);
    setActiveTab('medicineDetails');
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
          onMedicineSelect={handleMedicineSelect}
          onMedicineUpload={handleMedicineUpload}
        />;
      case 'scan':
        return <ScanContent onMedicineScan={handleMedicineScan} />;
      case 'history':
        return <HistoryContent onMedicineSelect={handleMedicineSelect} />;
      case 'profile':
        // Check if user is admin to show admin profile
        return isAdmin ? (
          <AdminProfileScreen 
            onSettingsPress={() => setActiveTab('settings')} 
            onPrivacyPolicyPress={() => setActiveTab('privacyPolicy')} 
            onAboutPress={() => setActiveTab('about')} 
            onHelpSupportPress={() => setActiveTab('helpSupport')} 
            onUserManagementPress={() => setActiveTab('userManagement')} 
            onMedicineManagementPress={() => setActiveTab('medicineManagement')} 
          />
        ) : (
          <ProfileContent 
            onSettingsPress={() => setActiveTab('settings')} 
            onPrivacyPolicyPress={() => setActiveTab('privacyPolicy')} 
            onAboutPress={() => setActiveTab('about')} 
            onHelpSupportPress={() => setActiveTab('helpSupport')} 
          />
        );
      case 'adminProfile':
        return <AdminProfileScreen 
          onSettingsPress={() => setActiveTab('settings')} 
          onPrivacyPolicyPress={() => setActiveTab('privacyPolicy')} 
          onAboutPress={() => setActiveTab('about')} 
          onHelpSupportPress={() => setActiveTab('helpSupport')} 
          onUserManagementPress={() => setActiveTab('userManagement')} 
          onMedicineManagementPress={() => setActiveTab('medicineManagement')} 
        />;
      case 'userManagement':
        return <UserManagementScreen onBackPress={() => setActiveTab('adminProfile')} />;
      case 'medicineManagement':
        return <MedicineManagementScreen onBackPress={() => setActiveTab('adminProfile')} />;
      case 'settings':
        return <SettingsScreen 
          onBackPress={() => setActiveTab(isAdmin ? 'adminProfile' : 'profile')} 
          onAboutPress={() => setActiveTab('about')}
          onHelpSupportPress={() => setActiveTab('helpSupport')}
        />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onBackPress={() => setActiveTab(isAdmin ? 'adminProfile' : 'profile')} />;
      case 'about':
        return <AboutScreen onBackPress={() => setActiveTab(isAdmin ? 'adminProfile' : 'profile')} />;
      case 'helpSupport':
        return <HelpSupportScreen onBackPress={() => setActiveTab(isAdmin ? 'adminProfile' : 'profile')} />;
      case 'medicineDetails':
        return <MedicineDetailsScreen 
          medicine={selectedMedicine} 
          onBackPress={() => setActiveTab('scan')} 
        />;
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
          onMedicineSelect={handleMedicineSelect}
          onMedicineUpload={handleMedicineUpload}
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
    return activeTab === 'settings' || activeTab === 'privacyPolicy' || activeTab === 'about' || 
           activeTab === 'helpSupport' || activeTab === 'medicineDetails' || activeTab === 'userManagement' ||
           activeTab === 'medicineManagement';
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'} />
      <Header 
        userName={userInfo.name}
        userEmail={userInfo.email}
        onLogout={handleLogout}
        onUserInfoPress={() => {
          console.log('User info pressed, navigating to profile');
          setActiveTab(isAdmin ? 'adminProfile' : 'profile');
        }}
        onSettingsPress={() => {
          console.log('Settings pressed, navigating to settings');
          setActiveTab('settings');
        }}
        showBackButton={shouldShowBackButton()}
        onBackPress={handleBackPress}
        isAdmin={isAdmin}
      />
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      <BottomNavigation 
        activeTab={activeTab as NavigationMode} 
        onTabChange={(tab: NavigationMode) => setActiveTab(tab)} 
        isAdmin={isAdmin}
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