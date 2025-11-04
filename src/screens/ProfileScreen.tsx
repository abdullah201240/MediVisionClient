import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../lib/api';

type ProfileContentProps = {
  onSettingsPress?: () => void;
  onPrivacyPolicyPress?: () => void;
  onAboutPress?: () => void;
  onHelpSupportPress?: () => void;
};

const ProfileContent = ({ onSettingsPress, onPrivacyPolicyPress, onAboutPress, onHelpSupportPress }: ProfileContentProps) => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  
  // Refs for input fields to enable scrolling to them
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  
  const { showAlert } = useAlert();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  // User information data fetched from API
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  // Temporary state for editing
  const [editInfo, setEditInfo] = useState({...personalInfo});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.getProfile();
        
        if (response.error) {
          setError(response.error);
          showAlert({
            title: t('error'),
            message: response.error,
            type: 'error'
          });
          return;
        }
        
        if (response.data) {
          const userData = {
            fullName: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            dateOfBirth: response.data.dateOfBirth || '',
            gender: response.data.gender || '',
          };
          
          setPersonalInfo(userData);
          setEditInfo(userData);
          
          // Set profile image if available
          if (response.data.image) {
            setProfileImage(`http://192.168.21.101:3000/uploads/users/${response.data.image}`);
          }
        }
      } catch (err) {
        setError('Failed to fetch profile data');
        showAlert({
          title: t('error'),
          message: 'Failed to fetch profile data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const togglePersonalInfo = () => {
    setShowPersonalInfo(!showPersonalInfo);
    // Reset editing state when closing
    if (showPersonalInfo) {
      setIsEditing(false);
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setEditInfo({...personalInfo}); // Reset edit info to current values
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Always hide the date picker after selection on both platforms
    setShowDatePicker(false);
    
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setEditInfo({...editInfo, dateOfBirth: formattedDate});
    }
  };

  const getDateFromString = (dateString: string): Date => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const genderData = [
    { label: t('selectGender') || 'Select Gender', value: '' },
    { label: t('male') || 'Male', value: 'male' },
    { label: t('female') || 'Female', value: 'female' },
    { label: t('other') || 'Other', value: 'other' },
    { label: t('preferNotToSay') || 'Prefer not to say', value: 'prefer not to say' },
  ];

  const handleGenderChange = (itemValue: string) => {
    setEditInfo({...editInfo, gender: itemValue});
    if (Platform.OS === 'ios') {
      setShowGenderPicker(false);
    }
  };

  const handleSavePress = async () => {
    try {
      // Prepare data for update
      const updateData: any = {};
      
      if (editInfo.fullName !== personalInfo.fullName) {
        updateData.name = editInfo.fullName;
      }
      
      if (editInfo.phone !== personalInfo.phone) {
        updateData.phone = editInfo.phone;
      }
      
      if (editInfo.dateOfBirth !== personalInfo.dateOfBirth) {
        updateData.dateOfBirth = editInfo.dateOfBirth;
      }
      
      if (editInfo.gender !== personalInfo.gender) {
        updateData.gender = editInfo.gender;
      }
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        const response = await api.updateProfile(updateData);
        
        if (response.error) {
          showAlert({
            title: t('error'),
            message: response.error,
            type: 'error'
          });
          return;
        }
        
        if (response.data) {
          // Update local state with the complete updated data from API response
          // This ensures all fields are properly displayed, not just the changed ones
          const updatedData = {
            fullName: response.data.name || personalInfo.fullName,
            email: response.data.email || personalInfo.email, // Email should always be preserved
            phone: response.data.phone !== undefined ? response.data.phone : personalInfo.phone,
            dateOfBirth: response.data.dateOfBirth !== undefined ? response.data.dateOfBirth : personalInfo.dateOfBirth,
            gender: response.data.gender !== undefined ? response.data.gender : personalInfo.gender,
          };
          
          setPersonalInfo(updatedData);
          setEditInfo(updatedData);
        }
        
        showAlert({
          title: t('success'),
          message: t('personalInfoUpdated'),
          type: 'success'
        });
      } else {
        // No changes were made, but we still want to show success
        showAlert({
          title: t('success'),
          message: t('personalInfoUpdated'),
          type: 'success'
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      showAlert({
        title: t('error'),
        message: t('failedToUpdateProfile'),
        type: 'error'
      });
    }
  };

  const handleCancelPress = () => {
    setIsEditing(false);
    setEditInfo({...personalInfo}); // Reset edit info to current values
    setShowDatePicker(false);
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      showAlert({
        title: t('settings'),
        message: 'Settings screen would open here',
        type: 'info'
      });
    }
  };

  const handlePrivacyPolicyPress = () => {
    if (onPrivacyPolicyPress) {
      onPrivacyPolicyPress();
    } else {
      showAlert({
        title: t('privacyPolicy'),
        message: 'Privacy policy would be displayed here',
        type: 'info'
      });
    }
  };

  const handleHelpSupportPress = () => {
    if (onHelpSupportPress) {
      onHelpSupportPress();
    } else {
      showAlert({
        title: t('helpSupport'),
        message: 'Help and support options would be shown here',
        type: 'info'
      });
    }
  };

  const handleAboutPress = () => {
    if (onAboutPress) {
      onAboutPress();
    } else {
      showAlert({
        title: t('about'),
        message: 'App information would be displayed here',
        type: 'info'
      });
    }
  };

  const handleProfileImagePress = () => {
    Alert.alert(
      t('profileImage'),
      t('chooseOption'),
      [
        {
          text: t('camera'),
          onPress: pickImageFromCamera,
        },
        {
          text: t('gallery'),
          onPress: pickImageFromGallery,
        },
        {
          text: t('cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert({
          title: t('permissionDenied'),
          message: t('profileCameraPermissionRequired'),
          type: 'error'
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      showAlert({
        title: t('error'),
        message: t('failedToPickImage'),
        type: 'error'
      });
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert({
          title: t('permissionDenied'),
          message: t('profileGalleryPermissionRequired'),
          type: 'error'
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      showAlert({
        title: t('error'),
        message: t('failedToPickImage'),
        type: 'error'
      });
    }
  };

  const uploadProfileImage = async (imageUri: string) => {
    try {
      setProfileImageLoading(true);
      
      // Upload image using the URI directly
      const uploadResponse = await api.updateProfileImage(imageUri);
      
      if (uploadResponse.error) {
        showAlert({
          title: t('error'),
          message: uploadResponse.error,
          type: 'error'
        });
        return;
      }
      
      if (uploadResponse.data && uploadResponse.data.image) {
        // Update the profile image URL with the new image
        setProfileImage(`${api.getBaseUrl()}/uploads/users/${uploadResponse.data.image}`);
        showAlert({
          title: t('success'),
          message: t('profileImageUpdated'),
          type: 'success'
        });
      } else {
        showAlert({
          title: t('error'),
          message: t('failedToUploadImage'),
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      showAlert({
        title: t('error'),
        message: t('failedToUploadImage') + ': ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error'
      });
    } finally {
      setProfileImageLoading(false);
    }
  };

  const removeProfileImage = async () => {
    try {
      setProfileImageLoading(true);
      
      const response = await api.removeProfileImage();
      
      if (response.error) {
        showAlert({
          title: t('error'),
          message: response.error,
          type: 'error'
        });
        return;
      }
      
      setProfileImage(null);
      showAlert({
        title: t('success'),
        message: t('profileImageRemoved'),
        type: 'success'
      });
    } catch (error) {
      showAlert({
        title: t('error'),
        message: t('failedToRemoveImage'),
        type: 'error'
      });
    } finally {
      setProfileImageLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.content, isDarkMode && styles.darkContent, styles.centerContainer]}>
        <Text style={[styles.loadingText, isDarkMode && styles.darkLoadingText]}>{t('loading')}</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.content, isDarkMode && styles.darkContent, styles.centerContainer]}>
        <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, isDarkMode && styles.darkRetryButton]} 
          onPress={() => window.location.reload()}
        >
          <Text style={[styles.retryButtonText, isDarkMode && styles.darkRetryButtonText]}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView 
      style={[styles.content, isDarkMode && styles.darkContent]} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, isDarkMode && styles.darkProfileHeader]}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handleProfileImagePress} disabled={profileImageLoading}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.profileImagePlaceholder, isDarkMode && styles.darkProfileImagePlaceholder]}>
                <Ionicons name="person" size={40} color={isDarkMode ? "#94a3b8" : "#718096"} />
              </View>
            )}
            {profileImageLoading && (
              <View style={[StyleSheet.absoluteFill, styles.loadingOverlay, isDarkMode && styles.darkLoadingOverlay]}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          {profileImage && (
            <TouchableOpacity 
              style={[styles.removeImageButton, isDarkMode && styles.darkRemoveImageButton]} 
              onPress={removeProfileImage}
              disabled={profileImageLoading}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.profileName, isDarkMode && styles.darkProfileName]}>{personalInfo.fullName || t('user')}</Text>
        <Text style={[styles.profileEmail, isDarkMode && styles.darkProfileEmail]}>{personalInfo.email}</Text>
      </View>

      {/* Profile Options */}
      <View style={[styles.optionsContainer, isDarkMode && styles.darkOptionsContainer]}>
        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={togglePersonalInfo}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="person-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>{t('personalInformation')}</Text>
          <Ionicons 
            name={showPersonalInfo ? "chevron-up" : "chevron-forward"} 
            size={20} 
            color={isDarkMode ? "#94a3b8" : "#999"} 
          />
        </TouchableOpacity>

        {/* Personal Information Details - shown when expanded */}
        {showPersonalInfo && (
          <View style={[styles.personalInfoContainer, isDarkMode && styles.darkPersonalInfoContainer]}>
            {isEditing ? (
              // Edit Mode
              <>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('fullName')}:</Text>
                  <TextInput
                    ref={fullNameRef}
                    style={[styles.infoInput, isDarkMode && styles.darkInfoInput]}
                    value={editInfo.fullName}
                    onChangeText={(text) => setEditInfo({...editInfo, fullName: text})}
                    onFocus={() => {}}
                  />
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('email')}:</Text>
                  <TextInput
                    ref={emailRef}
                    style={[styles.infoInput, styles.disabledInput, isDarkMode && styles.darkInfoInput]}
                    value={editInfo.email}
                    onChangeText={(text) => setEditInfo({...editInfo, email: text})}
                    keyboardType="email-address"
                    editable={false} // Email should not be editable for security reasons
                    onFocus={() => {}}
                  />
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('phone')}:</Text>
                  <TextInput
                    ref={phoneRef}
                    style={[styles.infoInput, isDarkMode && styles.darkInfoInput]}
                    value={editInfo.phone}
                    onChangeText={(text) => setEditInfo({...editInfo, phone: text})}
                    keyboardType="phone-pad"
                    onFocus={() => {}}
                  />
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('dateOfBirth')}:</Text>
                  <TouchableOpacity 
                    style={[styles.datePickerButton, isDarkMode && styles.darkDatePickerButton]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={[styles.datePickerText, isDarkMode && styles.darkDatePickerText]}>
                      {editInfo.dateOfBirth || t('selectDate')}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={isDarkMode ? "#94a3b8" : "#718096"} />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={getDateFromString(editInfo.dateOfBirth)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    style={isDarkMode ? { backgroundColor: '#1a1a1a' } : {}}
                    themeVariant={isDarkMode ? "dark" : "light"}
                  />
                )}
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('gender')}:</Text>
                  <Dropdown
                    style={[styles.dropdown, isDarkMode && styles.darkDropdown]}
                    placeholderStyle={[styles.placeholderStyle, isDarkMode && styles.darkPlaceholderStyle]}
                    selectedTextStyle={[styles.selectedTextStyle, isDarkMode && styles.darkSelectedTextStyle]}
                    iconStyle={styles.iconStyle}
                    data={genderData}
                    search={false}
                    labelField="label"
                    valueField="value"
                    placeholder={t('selectGender') || 'Select Gender'}
                    value={editInfo.gender}
                    onChange={item => {
                      setEditInfo({...editInfo, gender: item.value});
                    }}
                    renderLeftIcon={() => (
                      <Ionicons
                        style={styles.icon}
                        color={isDarkMode ? '#94a3b8' : '#718096'}
                        name="person-outline"
                        size={20}
                      />
                    )}
                    containerStyle={[styles.dropdownContainer, isDarkMode && styles.darkDropdownContainer]}
                    activeColor={isDarkMode ? '#374151' : '#f9f9f9'}
                    itemTextStyle={[styles.itemTextStyle, isDarkMode && styles.darkItemTextStyle]}
                  />
                </View>

                <View style={styles.editButtonContainer}>
                  <TouchableOpacity style={[styles.saveButton, isDarkMode && styles.darkSaveButton]} onPress={handleSavePress}>
                    <Text style={[styles.saveButtonText, isDarkMode && styles.darkSaveButtonText]}>{t('save')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.cancelButton, isDarkMode && styles.darkCancelButton]} onPress={handleCancelPress}>
                    <Text style={[styles.cancelButtonText, isDarkMode && styles.darkCancelButtonText]}>{t('cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // View Mode
              <>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('fullName')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{personalInfo.fullName || t('notProvided')}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('email')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{personalInfo.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('phone')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{personalInfo.phone || t('notProvided')}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('dateOfBirth')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{personalInfo.dateOfBirth || t('notProvided')}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('gender')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{personalInfo.gender || t('notProvided')}</Text>
                </View>
                <TouchableOpacity style={[styles.editButton, isDarkMode && styles.darkEditButton]} onPress={handleEditPress}>
                  <Text style={[styles.editButtonText, isDarkMode && styles.darkEditButtonText]}>{t('editPersonalInfo')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={handleSettingsPress}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="settings-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>{t('settings')}</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={handlePrivacyPolicyPress}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="lock-closed-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>{t('privacyPolicy')}</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={handleHelpSupportPress}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="help-circle-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>{t('helpSupport')}</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={handleAboutPress}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="information-circle-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>{t('about')}</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContent: {
    backgroundColor: '#1a1a1a',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#2d3748',
  },
  darkLoadingText: {
    color: '#e2e8f0',
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 20,
  },
  darkErrorText: {
    color: '#fc8181',
  },
  retryButton: {
    backgroundColor: '#00835A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  darkRetryButton: {
    backgroundColor: '#0f4c3a',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  darkRetryButtonText: {
    color: '#e2e8f0',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f7fafc',
  },
  darkProfileHeader: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  profileImageContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00835A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    backgroundColor: '#e2e8f0',
  },
  darkProfileImagePlaceholder: {
    backgroundColor: '#374151',
  },
  removeImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#e53e3e',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  darkRemoveImageButton: {
    backgroundColor: '#f56565',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkLoadingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  darkProfileInitials: {
    color: '#e2e8f0',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  darkProfileName: {
    color: '#e2e8f0',
  },
  profileEmail: {
    fontSize: 16,
    color: '#718096',
  },
  darkProfileEmail: {
    color: '#94a3b8',
  },
  optionsContainer: {
    backgroundColor: '#fff',
  },
  darkOptionsContainer: {
    backgroundColor: '#1a1a1a',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  darkOptionItem: {
    borderBottomColor: '#334155',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  darkOptionIcon: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  darkOptionText: {
    color: '#e2e8f0',
  },
  personalInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  darkPersonalInfoContainer: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    width: 100,
    marginRight: 10,
  },
  darkInfoLabel: {
    color: '#94a3b8',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '400',
  },
  darkInfoValue: {
    color: '#e2e8f0',
  },
  infoInput: {
    flex: 1,
    fontSize: 14,
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  darkInfoInput: {
    color: '#e2e8f0',
    borderColor: '#4b5563',
    backgroundColor: '#374151',
  },
  disabledInput: {
    backgroundColor: '#e9ecef',
    opacity: 0.6,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  darkDatePickerButton: {
    borderColor: '#4b5563',
    backgroundColor: '#374151',
  },
  datePickerText: {
    fontSize: 14,
    color: '#2d3748',
  },
  darkDatePickerText: {
    color: '#e2e8f0',
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
  },
  darkDropdown: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#718096',
  },
  darkPlaceholderStyle: {
    color: '#94a3b8',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#2d3748',
  },
  darkSelectedTextStyle: {
    color: '#e2e8f0',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderRadius: 4,
  },
  darkDropdownContainer: {
    backgroundColor: '#1f2937', // Darker background for better contrast
    borderColor: '#4b5563',
  },
  itemTextStyle: {
    color: '#2d3748',
  },
  darkItemTextStyle: {
    color: '#ffffff', // White text in dark mode
  },
  editButton: {
    marginTop: 16,
    backgroundColor: '#00835A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  darkEditButton: {
    backgroundColor: '#0f4c3a',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  darkEditButtonText: {
    color: '#e2e8f0',
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00835A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  darkSaveButton: {
    backgroundColor: '#0f4c3a',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  darkSaveButtonText: {
    color: '#e2e8f0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },
  darkCancelButton: {
    backgroundColor: '#374151',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  darkCancelButtonText: {
    color: '#cbd5e1',
  },
});

export default ProfileContent;