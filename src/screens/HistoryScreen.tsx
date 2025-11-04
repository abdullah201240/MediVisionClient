import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api, UserHistory, SearchResultDto } from '../lib/api';

type HistoryScreenProps = {
  onMedicineSelect?: (medicine: any) => void;
};

const HistoryContent: React.FC<HistoryScreenProps> = ({ onMedicineSelect }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [historyItems, setHistoryItems] = useState<UserHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUserHistory(20);
      
      console.log('API Response:', response); // Debug log
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (response.data) {
        console.log('History Data:', response.data); // Debug log
        // Validate data structure before setting state
        const validHistoryItems = response.data.filter(item => 
          item && 
          typeof item.id === 'string' && 
          typeof item.actionType === 'string' && 
          typeof item.createdAt === 'string'
        );
        setHistoryItems(validHistoryItems);
      }
    } catch (err) {
      setError('Failed to fetch history');
      console.error('Error fetching user history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  const getActionName = (actionType: string) => {
    switch (actionType) {
      case 'scan':
        return t('scanMedicine');
      case 'upload':
        return t('uploadImages');
      case 'view':
        return t('viewDetails');
      default:
        return actionType;
    }
  };

  const getMedicineName = (resultData: SearchResultDto[] | null) => {
    if (!resultData || resultData.length === 0) {
      return t('noMedicineFound');
    }
    
    const medicine = resultData[0];
    // Try to get the name in the user's preferred language
    return medicine.nameBn || medicine.name || t('unknownMedicine');
  };

  const getMedicineBrand = (resultData: SearchResultDto[] | null) => {
    if (!resultData || resultData.length === 0) {
      return null;
    }
    
    const medicine = resultData[0];
    return medicine.brandBn || medicine.brand;
  };

  const getConfidence = (resultData: SearchResultDto[] | null) => {
    if (!resultData || resultData.length === 0) {
      return null;
    }
    
    const medicine = resultData[0];
    return medicine.confidence;
  };

  const getMedicineImage = (resultData: SearchResultDto[] | null) => {
    if (!resultData || resultData.length === 0) {
      return null;
    }
    
    const medicine = resultData[0];
    // Check if images array exists and has at least one image
    if (!medicine.images || medicine.images.length === 0) {
      return null;
    }
    
    // Use the matched_image if available, otherwise use the first image
    const imageFileName = medicine.matched_image || medicine.images[0];
    return `${api.getBaseUrl()}/uploads/medicines/${imageFileName}`;
  };

  const handleItemPress = async (historyItem: UserHistory) => {
    // If we have a medicineId, get the full medicine details and navigate
    if (historyItem.medicineId && onMedicineSelect) {
      try {
        const response = await api.getMedicineById(historyItem.medicineId);
        if (response.data) {
          onMedicineSelect(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch medicine details:', error);
        // Fallback to using resultData if available
        if (historyItem.resultData && historyItem.resultData.length > 0) {
          onMedicineSelect(historyItem.resultData[0]);
        }
      }
    } else if (historyItem.resultData && historyItem.resultData.length > 0 && onMedicineSelect) {
      // If we don't have a medicineId but have resultData, use the first result
      onMedicineSelect(historyItem.resultData[0]);
    }
  };

  // Add error boundary-like handling
  try {
    if (loading) {
      return (
        <View style={[styles.content, isDarkMode && styles.darkContent, styles.center]}>
          <ActivityIndicator size="large" color={isDarkMode ? "#4ade80" : "#1a7f5e"} />
          <Text style={[styles.loadingText, isDarkMode && styles.darkLoadingText]}>{t('loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.content, isDarkMode && styles.darkContent, styles.center]}>
          <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{t('error')}: {error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, isDarkMode && styles.darkRetryButton]} 
            onPress={fetchUserHistory}
          >
            <Text style={[styles.retryButtonText, isDarkMode && styles.darkRetryButtonText]}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={[styles.content, isDarkMode && styles.darkContent]}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>{t('scanHistory')}</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>{t('recentScans')}</Text>
        
        <View style={styles.historyList}>
          {historyItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>{t('noHistory')}</Text>
            </View>
          ) : (
            historyItems.map((item) => {
              // Add safety checks for each item
              if (!item) return null;
              
              const medicineName = getMedicineName(item.resultData);
              const medicineBrand = getMedicineBrand(item.resultData);
              const confidence = getConfidence(item.resultData);
              const medicineImage = getMedicineImage(item.resultData);
              
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.historyItem, isDarkMode && styles.darkHistoryItem]}
                  onPress={() => handleItemPress(item)}
                >
                  {medicineImage ? (
                    <Image 
                      source={{ uri: medicineImage }} 
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.itemIcon, isDarkMode && styles.darkItemIcon]}>
                      <Text style={styles.iconText}>
                        {item.actionType === 'scan' ? '📷' : item.actionType === 'upload' ? '📤' : '👁️'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, isDarkMode && styles.darkItemName]}>
                      {getActionName(item.actionType || '')}
                    </Text>
                    {medicineName && (
                      <Text style={[styles.medicineName, isDarkMode && styles.darkMedicineName]}>
                        {medicineName}
                      </Text>
                    )}
                    {medicineBrand && (
                      <Text style={[styles.medicineBrand, isDarkMode && styles.darkMedicineBrand]}>
                        {medicineBrand}
                      </Text>
                    )}
                    <Text style={[styles.itemDate, isDarkMode && styles.darkItemDate]}>
                      {formatDate(item.createdAt || '')} {t('at')} {formatTime(item.createdAt || '')}
                    </Text>
                    {confidence && (
                      <Text style={[styles.confidence, isDarkMode && styles.darkConfidence]}>
                        {t('confidence')}: {confidence}
                      </Text>
                    )}
                    {item.isSuccessful === false && (
                      <Text style={[styles.errorStatus, isDarkMode && styles.darkErrorStatus]}>
                        {t('failed')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    );
  } catch (renderError) {
    console.error('Error rendering HistoryScreen:', renderError);
    return (
      <View style={[styles.content, isDarkMode && styles.darkContent, styles.center]}>
        <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>
          {t('error')}: Failed to render history screen
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  darkContent: {
    backgroundColor: '#1a1a1a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 20,
    marginBottom: 5,
  },
  darkTitle: {
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 20,
  },
  darkSubtitle: {
    color: '#94a3b8',
  },
  historyList: {
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  darkHistoryItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a7f5e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  darkItemIcon: {
    backgroundColor: '#0f4c3a',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 3,
  },
  darkItemName: {
    color: '#e2e8f0',
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: 2,
  },
  darkMedicineName: {
    color: '#cbd5e0',
  },
  medicineBrand: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 3,
  },
  darkMedicineBrand: {
    color: '#94a3b8',
  },
  itemDate: {
    fontSize: 14,
    color: '#718096',
  },
  darkItemDate: {
    color: '#94a3b8',
  },
  confidence: {
    fontSize: 12,
    color: '#4a5568',
    marginTop: 2,
  },
  darkConfidence: {
    color: '#a0aec0',
  },
  errorStatus: {
    fontSize: 12,
    color: '#e53e3e',
    marginTop: 3,
  },
  darkErrorStatus: {
    color: '#fc8181',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    backgroundColor: '#1a7f5e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  darkRetryButton: {
    backgroundColor: '#0f4c3a',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  darkRetryButtonText: {
    color: '#e2e8f0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
  },
  darkEmptyText: {
    color: '#94a3b8',
  },
});

export default HistoryContent;