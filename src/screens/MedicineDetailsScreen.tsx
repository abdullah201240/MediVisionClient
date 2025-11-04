import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type MedicineDetailsScreenProps = {
  medicine: any; // Updated to accept any medicine object from backend
  onBackPress: () => void;
};

const MedicineDetailsScreen: React.FC<MedicineDetailsScreenProps> = ({ medicine, onBackPress }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const renderSection = (title: string, content: string | string[]) => {
    // Don't render section if there's no content
    if (!content || (Array.isArray(content) && content.length === 0)) {
      return null;
    }
    
    return (
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
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]} numberOfLines={1}>
          {t('medicineDetails')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Medicine Image */}
        <View style={[styles.imageContainer, isDarkMode && styles.darkImageContainer]}>
          {medicine.images && medicine.images.length > 0 ? (
            <Image 
              source={{ uri: `http://192.168.21.101:3000/uploads/medicines/${medicine.images[0]}` }}
              style={styles.medicineImage} 
              resizeMode="contain" 
            />
          ) : (
            <View style={[styles.imagePlaceholder, isDarkMode && styles.darkImagePlaceholder]}>
              <Ionicons name="cube" size={64} color={isDarkMode ? "#4ade80" : "#00835A"} />
            </View>
          )}
        </View>

        {/* Medicine Name and Basic Info */}
        <View style={[styles.infoContainer, isDarkMode && styles.darkInfoContainer]}>
          <Text style={[styles.medicineName, isDarkMode && styles.darkMedicineName]}>{medicine.name}</Text>
          {medicine.nameBn && (
            <Text style={[styles.medicineNameBn, isDarkMode && styles.darkMedicineNameBn]}>{medicine.nameBn}</Text>
          )}
          {medicine.brand && (
            <Text style={[styles.manufacturer, isDarkMode && styles.darkManufacturer]}>{medicine.brand}</Text>
          )}
          {medicine.brandBn && (
            <Text style={[styles.manufacturerBn, isDarkMode && styles.darkManufacturerBn]}>{medicine.brandBn}</Text>
          )}
          {medicine.origin && (
            <Text style={[styles.origin, isDarkMode && styles.darkOrigin]}>
              {t('origin')}: {medicine.origin}
            </Text>
          )}
          {medicine.originBn && (
            <Text style={[styles.originBn, isDarkMode && styles.darkOriginBn]}>
              {medicine.originBn}
            </Text>
          )}
        </View>

        {/* Details/Description */}
        {renderSection(t('description'), medicine.details || medicine.detailsBn)}

        {/* Side Effects */}
        {renderSection(t('sideEffects'), medicine.sideEffects || medicine.sideEffectsBn)}

        {/* Usage */}
        {renderSection(t('usage'), medicine.usage || medicine.usageBn)}

        {/* How to Use */}
        {renderSection(t('howToUse'), medicine.howToUse || medicine.howToUseBn)}

        {/* No information message if no content */}
        {!medicine.details && !medicine.detailsBn && 
         !medicine.sideEffects && !medicine.sideEffectsBn &&
         !medicine.usage && !medicine.usageBn &&
         !medicine.howToUse && !medicine.howToUseBn && (
          <View style={[styles.section, isDarkMode && styles.darkSection]}>
            <Text style={[styles.sectionText, isDarkMode && styles.darkSectionText, styles.noInfoText]}>
              {t('noDetailedInformation')}
            </Text>
          </View>
        )}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
    color: '#1e293b',
    marginBottom: 4,
  },
  darkMedicineName: {
    color: '#f1f5f9',
  },
  medicineNameBn: {
    fontSize: 20,
    color: '#334155',
    marginBottom: 4,
  },
  darkMedicineNameBn: {
    color: '#e2e8f0',
  },
  manufacturer: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 4,
  },
  darkManufacturer: {
    color: '#cbd5e1',
  },
  manufacturerBn: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  darkManufacturerBn: {
    color: '#94a3b8',
  },
  origin: {
    fontSize: 14,
    color: '#00835A',
    fontWeight: '600',
  },
  darkOrigin: {
    color: '#4ade80',
  },
  originBn: {
    fontSize: 12,
    color: '#00835A',
  },
  darkOriginBn: {
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
    color: '#1e293b',
    marginBottom: 12,
  },
  darkSectionTitle: {
    color: '#f1f5f9',
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
    color: '#334155',
    lineHeight: 22,
    flex: 1,
  },
  darkSectionText: {
    color: '#e2e8f0',
  },
  noInfoText: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#64748b',
  },
  darkNoInfoText: {
    color: '#94a3b8',
  },
});

export default MedicineDetailsScreen;