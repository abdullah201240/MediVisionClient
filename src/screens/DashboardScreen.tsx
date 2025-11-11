import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Easing, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LanguageContext';
import { BlurView } from 'expo-blur';
import RecentlyScanned from '../components/RecentlyScanned';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { api } from '../lib/api';
import { useAlert } from '../context/AlertContext';

// Define the props type
type DashboardContentProps = {
  onScanPress?: () => void;
  onHistoryPress?: () => void;
  onMedicineSelect?: (medicineId: string) => void;
  onMedicineUpload?: (medicineData: any) => void;
};

// Define navigation param list
type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  LanguageSelection: undefined;
};

const DashboardContent: React.FC<DashboardContentProps> = ({ onScanPress, onHistoryPress, onMedicineSelect, onMedicineUpload }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const { showAlert } = useAlert();
  
  // Add state for search term and suggestions
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Add debounce timer ref
  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  
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

  // Handle text search with debounce
  const handleTextSearch = async (text: string) => {
    setSearchTerm(text);
    
    // Clear previous timer
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    
    // If text is empty, hide suggestions
    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Set timer for debounced search
    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        console.log('Performing search for:', text.trim()); // Debug log
        const response = await api.searchMedicines(text.trim());
        console.log('Search response:', response); // Debug log
        
        if (response.data && response.data.length > 0) {
          // Show only top 5 suggestions
          setSuggestions(response.data.slice(0, 5));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error searching medicines:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (medicine: any) => {
    setSearchTerm(medicine.name);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Pass the selected medicine to the callback
    if (onMedicineUpload) {
      onMedicineUpload([medicine]);
    }
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      // Hide suggestions
      setShowSuggestions(false);
      
      // Perform full search
      performFullSearch(searchTerm.trim());
    }
  };

  // Perform full search
  const performFullSearch = async (term: string) => {
    try {
      console.log('Performing full search for:', term); // Debug log
      const response = await api.searchMedicines(term);
      console.log('Full search response:', response); // Debug log
      
      if (response.error) {
        showAlert({
          title: t('error'),
          message: response.error,
          type: 'error'
        });
        return;
      }
      
      // Always pass the data to the callback, even if it's an empty array
      if (onMedicineUpload) {
        onMedicineUpload(response.data || []);
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
      showAlert({
        title: t('error'),
        message: t('failedToSearchMedicine'),
        type: 'error'
      });
    }
  };

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
      
      // Process the first selected image
      if (result.assets.length > 0) {
        try {
          // Show loading state
          Alert.alert(t('loading'), t('loading'));
          
          // Search for medicine by the first image
          const response = await api.searchMedicineByImage(result.assets[0].uri);
          
          // Save upload history
          try {
            // In a real implementation, we would save the history to the server
            // For now, we'll just log it
            console.log('Upload history saved:', {
              actionType: 'upload',
              imageData: result.assets[0].uri,
              resultData: response.data,
              isSuccessful: !response.error,
              errorMessage: response.error || null
            });
          } catch (historyError) {
            console.error('Failed to save upload history:', historyError);
          }
          
          if (response.error) {
            showAlert({
              title: t('error'),
              message: response.error,
              type: 'error'
            });
            return;
          }
          
          if (response.data && response.data.length > 0) {
            // If we found matching medicines, pass them to the callback
            if (onMedicineUpload) {
              onMedicineUpload(response.data); // Pass all results, not just the first one
            }
          } else {
            // No matching medicines found - show a more user-friendly message
            showAlert({
              title: t('noMedicinesFound'),
              message: t('noMedicinesFoundMessage'),
              type: 'info'
            });
          }
        } catch (error) {
          console.error('Error searching medicine by image:', error);
          showAlert({
            title: t('error'),
            message: t('failedToSearchMedicine'),
            type: 'error'
          });
        }
      }
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
            value={searchTerm}
            onChangeText={handleTextSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow for clicks
              setTimeout(() => setShowSuggestions(false), 150);
            }}
          />
          {isSearching && (
            <ActivityIndicator 
              size="small" 
              color={isDarkMode ? "#4ade80" : "#1a7f5e"} 
              style={styles.searchIndicator} 
            />
          )}
        </BlurView>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={[styles.suggestionsContainer, isDarkMode && styles.darkSuggestionsContainer]}>
            {suggestions.map((medicine, index) => (
              <TouchableOpacity
                key={medicine.id}
                style={[styles.suggestionItem, isDarkMode && styles.darkSuggestionItem]}
                onPress={() => handleSuggestionSelect(medicine)}
              >
                <View style={styles.suggestionContent}>
                  <Text style={[styles.suggestionName, isDarkMode && styles.darkSuggestionName]}>
                    {medicine.name}
                  </Text>
                  {medicine.brand && (
                    <Text style={[styles.suggestionBrand, isDarkMode && styles.darkSuggestionBrand]}>
                      {medicine.brand}
                    </Text>
                  )}
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={18} 
                  color={isDarkMode ? "#94a3b8" : "#94a3b8"} 
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  // Search suggestions styles
  searchIndicator: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247, 250, 252, 0.95)',
    borderRadius: 12,
    marginTop: 4,
    zIndex: 100,
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  darkSuggestionsContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 127, 94, 0.1)',
  },
  darkSuggestionItem: {
    borderBottomColor: 'rgba(74, 222, 128, 0.1)',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 2,
  },
  darkSuggestionName: {
    color: '#e2e8f0',
  },
  suggestionBrand: {
    fontSize: 14,
    color: '#718096',
  },
  darkSuggestionBrand: {
    color: '#94a3b8',
  },
});

export default DashboardContent;