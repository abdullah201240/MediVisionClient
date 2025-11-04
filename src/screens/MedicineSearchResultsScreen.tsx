import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type MedicineSearchResultsScreenProps = {
  medicines: any[];
  onMedicineSelect: (medicine: any) => void;
  onBackPress: () => void;
};

const MedicineSearchResultsScreen: React.FC<MedicineSearchResultsScreenProps> = ({ 
  medicines, 
  onMedicineSelect,
  onBackPress 
}) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleMedicinePress = async (medicine: any) => {
    setLoading(true);
    try {
      // In a real implementation, you might want to fetch full medicine details here
      // For now, we'll just pass the medicine data we already have
      onMedicineSelect(medicine);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMedicineItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.medicineItem, isDarkMode && styles.darkMedicineItem]}
      onPress={() => handleMedicinePress(item)}
      disabled={loading}
    >
      <View style={styles.medicineImageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image 
            source={{ uri: `http://192.168.21.101:3000/uploads/medicines/${item.images[0]}` }}
            style={styles.medicineImage}
          />
        ) : (
          <View style={[styles.imagePlaceholder, isDarkMode && styles.darkImagePlaceholder]}>
            <Ionicons name="cube" size={32} color={isDarkMode ? "#4ade80" : "#00835A"} />
          </View>
        )}
      </View>
      
      <View style={styles.medicineInfo}>
        <Text style={[styles.medicineName, isDarkMode && styles.darkMedicineName]} numberOfLines={2}>
          {item.name}
        </Text>
        {item.nameBn && (
          <Text style={[styles.medicineNameBn, isDarkMode && styles.darkMedicineNameBn]} numberOfLines={1}>
            {item.nameBn}
          </Text>
        )}
        <Text style={[styles.medicineBrand, isDarkMode && styles.darkMedicineBrand]} numberOfLines={1}>
          {item.brand || '-'}
        </Text>
        <Text style={[styles.medicineOrigin, isDarkMode && styles.darkMedicineOrigin]} numberOfLines={1}>
          {item.origin || '-'}
        </Text>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? "#94a3b8" : "#999"} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
          {t('similarMedicines')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? "#4ade80" : "#00835A"} />
          <Text style={[styles.loadingText, isDarkMode && styles.darkLoadingText]}>
            {t('loading')}
          </Text>
        </View>
      ) : medicines && medicines.length > 0 ? (
        <FlatList
          data={medicines}
          renderItem={renderMedicineItem}
          keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `medicine-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="search" 
            size={64} 
            color={isDarkMode ? "#4ade80" : "#00835A"} 
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
            {t('noMedicinesFound')}
          </Text>
          <Text style={[styles.emptySubtext, isDarkMode && styles.darkEmptySubtext]}>
            {t('noMedicinesFoundMessage')}
          </Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
    backgroundColor: '#fff',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  darkHeaderTitle: {
    color: '#f1f5f9',
  },
  headerSpacer: {
    width: 40, // Same width as back button for alignment
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  darkLoadingText: {
    color: '#cbd5e1',
  },
  listContent: {
    padding: 16,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkMedicineItem: {
    backgroundColor: '#2d3748',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  medicineImageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  medicineImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkImagePlaceholder: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  medicineInfo: {
    flex: 1,
    marginRight: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  darkMedicineName: {
    color: '#f1f5f9',
  },
  medicineNameBn: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  darkMedicineNameBn: {
    color: '#94a3b8',
  },
  medicineBrand: {
    fontSize: 14,
    color: '#00835A',
    fontWeight: '500',
    marginBottom: 2,
  },
  darkMedicineBrand: {
    color: '#4ade80',
  },
  medicineOrigin: {
    fontSize: 12,
    color: '#64748b',
  },
  darkMedicineOrigin: {
    color: '#94a3b8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  darkEmptyText: {
    color: '#f1f5f9',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  darkEmptySubtext: {
    color: '#94a3b8',
  },
});

export default MedicineSearchResultsScreen;