import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LanguageContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import RecentlyScanned from '../components/RecentlyScanned';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

// Define the props type
type DashboardContentProps = {
  onScanPress?: () => void;
  onHistoryPress?: () => void;
  onMedicineSelect?: (medicineId: string) => void;
};

// Define navigation param list
type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  LanguageSelection: undefined;
};

const DashboardContent = ({ onScanPress, onHistoryPress, onMedicineSelect }: DashboardContentProps) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Fallback navigation if props are not provided
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Entrance animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered card animations
    Animated.stagger(150, [
      Animated.spring(cardAnims[0], {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnims[1], {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnims[2], {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnims[3], {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleUploadImages = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        t('permissionRequired'),
        t('galleryPermissionRequired'),
        [{ text: t('ok') }]
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Selected images:', result.assets);
      Alert.alert(
        t('imagesSelected'),
        `${result.assets.length} ${t('imagesSelectedMessage')}`,
        [{ text: t('ok') }]
      );
      // Here you would typically process the selected images
      // For example, upload them to a server or display them in the app
    }
  };

  return (
    <Animated.ScrollView 
      style={[styles.content, isDarkMode && styles.darkContent, { opacity: fadeAnim }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Search Bar with Glass Effect */}
      <Animated.View 
        style={[
          styles.searchContainerWrapper,
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <BlurView intensity={80} style={styles.searchContainer} tint={isDarkMode ? "dark" : "light"}>
          <Ionicons name="search" size={20} color={isDarkMode ? "#ccc" : "#999"} style={styles.searchIcon} />
          <TextInput 
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder={t('searchMedicine')}
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          />
        </BlurView>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.Text 
        style={[
          styles.sectionTitle,
          isDarkMode && styles.darkSectionTitle,
          {
            opacity: cardAnims[0],
            transform: [{
              translateY: cardAnims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
      >
        {t('quickActions')}
      </Animated.Text>

      {/* Scan Medicine Card */}
      <Animated.View
        style={{
          opacity: cardAnims[1],
          transform: [{
            translateY: cardAnims[1].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          }]
        }}
      >
        <TouchableOpacity style={[styles.primaryCard, isDarkMode && styles.darkPrimaryCard]} onPress={onScanPress}>
          <Animated.View 
            style={[
              styles.iconContainer,
              isDarkMode && styles.darkIconContainer,
              {
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05]
                  })
                }]
              }
            ]}
          >
            <Ionicons name="camera" size={28} color={isDarkMode ? "#1a7f5e" : "#fff"} />
          </Animated.View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>{t('scanMedicine')}</Text>
            <Text style={[styles.cardSubtitle, isDarkMode && styles.darkCardSubtitle]}>{t('useCameraToScan')}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Upload Images Card */}
      <Animated.View
        style={{
          opacity: cardAnims[2],
          transform: [{
            translateY: cardAnims[2].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          }]
        }}
      >
        <TouchableOpacity style={[styles.secondaryCard, isDarkMode && styles.darkSecondaryCard]} onPress={handleUploadImages}>
          <BlurView intensity={90} style={[styles.iconContainerSecondary, isDarkMode && styles.darkIconContainerSecondary]} tint={isDarkMode ? "dark" : "light"}>
            <Animated.View
              style={{
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1]
                  })
                }]
              }}
            >
              <Ionicons name="images" size={28} color={isDarkMode ? "#4ade80" : "#1a7f5e"} />
            </Animated.View>
          </BlurView>
          <View style={styles.cardContent}>
            <Text style={[styles.secondaryCardTitle, isDarkMode && styles.darkSecondaryCardTitle]}>{t('uploadImages')}</Text>
            <Text style={[styles.secondaryCardSubtitle, isDarkMode && styles.darkSecondaryCardSubtitle]}>{t('selectFromGallery')}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Saved Records Card */}
      <Animated.View
        style={{
          opacity: cardAnims[3],
          transform: [{
            translateY: cardAnims[3].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          }]
        }}
      >
        <TouchableOpacity 
          style={[styles.secondaryCard, isDarkMode && styles.darkSecondaryCard]} 
          onPress={() => {
            console.log('Saved Records button pressed');
            if (onHistoryPress) {
              console.log('Calling onHistoryPress');
              onHistoryPress();
            } else {
              console.log('onHistoryPress is not defined, using fallback navigation');
              // Fallback navigation
              navigation.navigate('MainTabs' as any);
            }
          }}
        >
          <BlurView intensity={90} style={[styles.iconContainerSecondary, isDarkMode && styles.darkIconContainerSecondary]} tint={isDarkMode ? "dark" : "light"}>
            <Animated.View
              style={{
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1]
                  })
                }]
              }}
            >
              <Ionicons name="time" size={28} color={isDarkMode ? "#4ade80" : "#1a7f5e"} />
            </Animated.View>
          </BlurView>
          <View style={styles.cardContent}>
            <Text style={[styles.secondaryCardTitle, isDarkMode && styles.darkSecondaryCardTitle]}>{t('savedRecords')}</Text>
            <Text style={[styles.secondaryCardSubtitle, isDarkMode && styles.darkSecondaryCardSubtitle]}>{t('viewScanHistory')}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Recently Scanned - Using the new component */}
      <RecentlyScanned onMedicineSelect={onMedicineSelect} />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  darkContent: {
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  searchContainerWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(247, 250, 252, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2d3748',
    backgroundColor: 'transparent',
  },
  darkSearchInput: {
    color: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 16,
  },
  darkSectionTitle: {
    color: '#e2e8f0',
  },
  primaryCard: {
    backgroundColor: '#1a7f5e',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  darkPrimaryCard: {
    backgroundColor: '#0f4c3a',
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  darkIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  darkCardTitle: {
    color: '#e2e8f0',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  darkCardSubtitle: {
    color: 'rgba(226, 232, 240, 0.9)',
  },
  secondaryCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(247, 250, 252, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(26, 127, 94, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  darkSecondaryCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  iconContainerSecondary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  darkIconContainerSecondary: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  secondaryCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  darkSecondaryCardTitle: {
    color: '#e2e8f0',
  },
  secondaryCardSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  darkSecondaryCardSubtitle: {
    color: '#94a3b8',
  },
});

export default DashboardContent;