import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type AdminProfileScreenProps = {
  onSettingsPress?: () => void;
  onPrivacyPolicyPress?: () => void;
  onAboutPress?: () => void;
  onHelpSupportPress?: () => void;
  onUserManagementPress?: () => void;
  onMedicineManagementPress?: () => void;
};

const AdminProfileScreen = ({ 
  onSettingsPress, 
  onPrivacyPolicyPress, 
  onAboutPress, 
  onHelpSupportPress,
  onUserManagementPress,
  onMedicineManagementPress
}: AdminProfileScreenProps) => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Refs for input fields to enable scrolling to them
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const dobRef = useRef(null);
  const genderRef = useRef(null);
  
  const { showAlert } = useAlert();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  // Sample admin information data
  const [adminInfo, setAdminInfo] = useState({
    fullName: 'System Admin',
    email: 'admin@midivision.com',
    phone: '+1234567890',
    dateOfBirth: '01 Jan 1980',
    gender: 'Other',
    role: 'Administrator',
  });

  // Temporary state for editing
  const [editInfo, setEditInfo] = useState({...adminInfo});

  const togglePersonalInfo = () => {
    setShowPersonalInfo(!showPersonalInfo);
    // Reset editing state when closing
    if (showPersonalInfo) {
      setIsEditing(false);
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setEditInfo({...adminInfo}); // Reset edit info to current values
  };

  const handleSavePress = () => {
    setAdminInfo({...editInfo});
    setIsEditing(false);
    showAlert({
      title: t('success'),
      message: t('personalInfoUpdated'),
      type: 'success'
    });
  };

  const handleCancelPress = () => {
    setIsEditing(false);
    setEditInfo({...adminInfo}); // Reset edit info to current values
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

  const handleUserManagementPress = () => {
    if (onUserManagementPress) {
      onUserManagementPress();
    }
  };

  const handleMedicineManagementPress = () => {
    if (onMedicineManagementPress) {
      onMedicineManagementPress();
    }
  };

  return (
    <ScrollView 
      style={[styles.content, isDarkMode && styles.darkContent]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, isDarkMode && styles.darkProfileHeader]}>
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImage, isDarkMode && styles.darkProfileImage]}>
            <Text style={[styles.profileInitials, isDarkMode && styles.darkProfileInitials]}>SA</Text>
          </View>
          <View style={[styles.adminBadge, isDarkMode && styles.darkAdminBadge]}>
            <Text style={[styles.adminBadgeText, isDarkMode && styles.darkAdminBadgeText]}>ADMIN</Text>
          </View>
        </View>
        <Text style={[styles.profileName, isDarkMode && styles.darkProfileName]}>{adminInfo.fullName}</Text>
        <Text style={[styles.profileEmail, isDarkMode && styles.darkProfileEmail]}>{adminInfo.email}</Text>
        <Text style={[styles.profileRole, isDarkMode && styles.darkProfileRole]}>{adminInfo.role}</Text>
      </View>

      {/* Admin Management Options */}
      <View style={[styles.optionsContainer, isDarkMode && styles.darkOptionsContainer]}>
        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={handleUserManagementPress}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="people-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>User Management</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionItem, isDarkMode && styles.darkOptionItem]} onPress={handleMedicineManagementPress}>
          <View style={[styles.optionIcon, isDarkMode && styles.darkOptionIcon]}>
            <Ionicons name="medical-outline" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>Medicine Management</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        </TouchableOpacity>

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
                  />
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('email')}:</Text>
                  <TextInput
                    ref={emailRef}
                    style={[styles.infoInput, isDarkMode && styles.darkInfoInput]}
                    value={editInfo.email}
                    onChangeText={(text) => setEditInfo({...editInfo, email: text})}
                    keyboardType="email-address"
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
                  />
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('dateOfBirth')}:</Text>
                  <TextInput
                    ref={dobRef}
                    style={[styles.infoInput, isDarkMode && styles.darkInfoInput]}
                    value={editInfo.dateOfBirth}
                    onChangeText={(text) => setEditInfo({...editInfo, dateOfBirth: text})}
                  />
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('gender')}:</Text>
                  <TextInput
                    ref={genderRef}
                    style={[styles.infoInput, isDarkMode && styles.darkInfoInput]}
                    value={editInfo.gender}
                    onChangeText={(text) => setEditInfo({...editInfo, gender: text})}
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
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{adminInfo.fullName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('email')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{adminInfo.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('phone')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{adminInfo.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('dateOfBirth')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{adminInfo.dateOfBirth}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>{t('gender')}:</Text>
                  <Text style={[styles.infoValue, isDarkMode && styles.darkInfoValue]}>{adminInfo.gender}</Text>
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
    </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f7fafc',
    position: 'relative',
  },
  darkProfileHeader: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00835A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  darkProfileImage: {
    backgroundColor: '#0f4c3a',
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  darkProfileInitials: {
    color: '#e2e8f0',
  },
  adminBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  darkAdminBadge: {
    backgroundColor: '#dc2626',
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  darkAdminBadgeText: {
    color: '#f8fafc',
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
    marginBottom: 5,
  },
  darkProfileEmail: {
    color: '#94a3b8',
  },
  profileRole: {
    fontSize: 14,
    color: '#00835A',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkProfileRole: {
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
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

export default AdminProfileScreen;