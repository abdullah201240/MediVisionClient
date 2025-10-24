import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type HistoryScreenProps = {
  onMedicineSelect?: (medicine: any) => void;
};

const HistoryContent: React.FC<HistoryScreenProps> = ({ onMedicineSelect }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  // Sample history data
  const historyItems = [
    { id: 1, name: t('paracetamol'), date: '2023-05-15', time: '10:30 AM' },
    { id: 2, name: t('napaExtra'), date: '2023-05-14', time: '2:15 PM' },
    { id: 3, name: t('uploadImages'), date: '2023-05-12', time: '9:45 AM' },
    { id: 4, name: 'Vitamin C', date: '2023-05-10', time: '4:20 PM' },
    { id: 5, name: 'Antibiotic', date: '2023-05-08', time: '11:30 AM' },
  ];

  // Sample medicine data for details
  const medicineData: any = {
    1: {
      id: '1',
      name: t('paracetamol'),
      genericName: 'Paracetamol',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      dosage: '500mg',
      description: 'Paracetamol is a common painkiller used to treat aches and pains. It can also be used to reduce a high temperature (fever).',
      indications: [
        'Fever',
        'Headache',
        'Muscle aches',
        'Arthritis',
        'Toothache',
        'Cold and flu symptoms'
      ],
      contraindications: [
        'Severe liver disease',
        'Severe kidney disease',
        'Alcoholism'
      ],
      sideEffects: [
        'Nausea',
        'Stomach pain',
        'Loss of appetite',
        'Liver damage (with overdose)'
      ],
      precautions: [
        'Do not exceed recommended dose',
        'Avoid alcohol',
        'Consult doctor if symptoms persist'
      ],
      interactions: [
        'Alcohol may increase liver toxicity',
        'Warfarin may increase bleeding risk'
      ],
      storage: 'Store below 30°C, away from moisture and light.'
    },
    2: {
      id: '2',
      name: t('napaExtra'),
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
    }
  };

  const handleItemPress = (itemId: number) => {
    if (onMedicineSelect && medicineData[itemId]) {
      onMedicineSelect(medicineData[itemId]);
    }
  };

  return (
    <ScrollView style={[styles.content, isDarkMode && styles.darkContent]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>{t('scanHistory')}</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>{t('recentScans')}</Text>
      
      <View style={styles.historyList}>
        {historyItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.historyItem, isDarkMode && styles.darkHistoryItem]}
            onPress={() => handleItemPress(item.id)}
          >
            <View style={[styles.itemIcon, isDarkMode && styles.darkItemIcon]}>
              <Text style={styles.iconText}>💊</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, isDarkMode && styles.darkItemName]}>{item.name}</Text>
              <Text style={[styles.itemDate, isDarkMode && styles.darkItemDate]}>{item.date} {t('at')} {item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
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
  itemDate: {
    fontSize: 14,
    color: '#718096',
  },
  darkItemDate: {
    color: '#94a3b8',
  },
});

export default HistoryContent;