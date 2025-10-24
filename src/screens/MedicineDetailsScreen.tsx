import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type MedicineDetailsScreenProps = {
  medicine: {
    id: string;
    name: string;
    genericName: string;
    manufacturer: string;
    dosage: string;
    description: string;
    indications: string[];
    contraindications: string[];
    sideEffects: string[];
    precautions: string[];
    interactions: string[];
    storage: string;
    imageUrl?: string;
  };
  onBackPress: () => void;
};

const MedicineDetailsScreen: React.FC<MedicineDetailsScreenProps> = ({ medicine, onBackPress }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const renderSection = (title: string, content: string | string[]) => (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>{title}</Text>
      {Array.isArray(content) ? (
        content.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons 
              name="ellipse" 
              size={8} 
              color={isDarkMode ? "#4ade80" : "#00835A"} 
              style={styles.bullet} 
            />
            <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>{item}</Text>
          </View>
        ))
      ) : (
        <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText]}>{content}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Medicine Image */}
        <View style={[styles.imageContainer, isDarkMode && styles.darkImageContainer]}>
          {medicine.imageUrl ? (
            <Image source={{ uri: medicine.imageUrl }} style={styles.medicineImage} resizeMode="contain" />
          ) : (
            <View style={[styles.imagePlaceholder, isDarkMode && styles.darkImagePlaceholder]}>
              <Ionicons name="cube" size={64} color={isDarkMode ? "#4ade80" : "#00835A"} />
            </View>
          )}
        </View>

        {/* Medicine Name and Basic Info */}
        <View style={[styles.infoContainer, isDarkMode && styles.darkInfoContainer]}>
          <Text style={[styles.medicineName, isDarkMode && styles.darkMedicineName]}>{medicine.name}</Text>
          <Text style={[styles.genericName, isDarkMode && styles.darkGenericName]}>{medicine.genericName}</Text>
          <Text style={[styles.manufacturer, isDarkMode && styles.darkManufacturer]}>{medicine.manufacturer}</Text>
          <Text style={[styles.dosage, isDarkMode && styles.darkDosage]}>{t('dosage')}: {medicine.dosage}</Text>
        </View>

        {/* Description */}
        {renderSection(t('description'), medicine.description)}

        {/* Indications */}
        {renderSection(t('indications'), medicine.indications)}

        {/* Contraindications */}
        {renderSection(t('contraindications'), medicine.contraindications)}

        {/* Side Effects */}
        {renderSection(t('sideEffects'), medicine.sideEffects)}

        {/* Precautions */}
        {renderSection(t('precautions'), medicine.precautions)}

        {/* Drug Interactions */}
        {renderSection(t('drugInteractions'), medicine.interactions)}

        {/* Storage Instructions */}
        {renderSection(t('storage'), medicine.storage)}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 16, // Add padding at the top since we removed the header
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  darkImageContainer: {
    // No specific dark mode styles needed
  },
  medicineImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkImagePlaceholder: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  infoContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkInfoContainer: {
    backgroundColor: '#2d3748',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b', // Darker color for better visibility in light mode
    marginBottom: 4,
  },
  darkMedicineName: {
    color: '#f1f5f9', // Lighter color for dark mode
  },
  genericName: {
    fontSize: 18,
    color: '#334155', // Darker color for better visibility in light mode
    marginBottom: 4,
  },
  darkGenericName: {
    color: '#e2e8f0', // Lighter color for dark mode
  },
  manufacturer: {
    fontSize: 16,
    color: '#334155', // Darker color for better visibility in light mode
    marginBottom: 8,
  },
  darkManufacturer: {
    color: '#cbd5e1', // Lighter color for dark mode
  },
  dosage: {
    fontSize: 16,
    color: '#00835A',
    fontWeight: '600',
  },
  darkDosage: {
    color: '#4ade80',
  },
  section: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 131, 90, 0.1)',
  },
  darkSection: {
    backgroundColor: '#2d3748',
    borderColor: 'rgba(74, 222, 128, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b', // Darker color for better visibility in light mode
    marginBottom: 12,
  },
  darkSectionTitle: {
    color: '#f1f5f9', // Lighter color for dark mode
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    marginTop: 6,
    marginRight: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#334155', // Darker color for better visibility in light mode
    lineHeight: 22,
    flex: 1,
  },
  darkSectionText: {
    color: '#e2e8f0', // Lighter color for dark mode
  },
});

export default MedicineDetailsScreen;