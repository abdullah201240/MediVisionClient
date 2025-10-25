import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type Medicine = {
  id: string;
  name: string;
  brand: string;
  genericName: string;
  status: 'active' | 'inactive';
};

const MedicineManagementScreen = ({ onBackPress }: { onBackPress: () => void }) => {
  const { showAlert } = useAlert();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: '1', name: 'Napa Extra', brand: 'Beximco', genericName: 'Paracetamol + Caffeine', status: 'active' },
    { id: '2', name: 'Seclo', brand: 'Square', genericName: 'Esomeprazole', status: 'active' },
    { id: '3', name: 'Ace Plus', brand: 'ACI', genericName: 'Paracetamol + Caffeine', status: 'active' },
    { id: '4', name: 'Pantoprazole', brand: 'Incepta', genericName: 'Pantoprazole Sodium', status: 'inactive' },
    { id: '5', name: 'Amoxicillin', brand: 'Reneta', genericName: 'Amoxicillin Trihydrate', status: 'active' },
  ]);

  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    medicine.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMedicineStatus = (medicineId: string) => {
    setMedicines(prevMedicines => 
      prevMedicines.map(medicine => 
        medicine.id === medicineId 
          ? { ...medicine, status: medicine.status === 'active' ? 'inactive' : 'active' } 
          : medicine
      )
    );
    
    showAlert({
      title: 'Success',
      message: 'Medicine status updated successfully',
      type: 'success'
    });
  };

  const deleteMedicine = (medicineId: string) => {
    showAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this medicine? This action cannot be undone.',
      type: 'warning',
      actions: [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setMedicines(prevMedicines => prevMedicines.filter(medicine => medicine.id !== medicineId));
            showAlert({
              title: 'Success',
              message: 'Medicine deleted successfully',
              type: 'success'
            });
          },
          style: 'destructive',
        },
      ]
    });
  };

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <View style={[styles.medicineItem, isDarkMode && styles.darkMedicineItem]}>
      <View style={styles.medicineInfo}>
        <View style={[styles.medicineAvatar, isDarkMode && styles.darkMedicineAvatar]}>
          <Ionicons name="medical" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </View>
        <View style={styles.medicineDetails}>
          <Text style={[styles.medicineName, isDarkMode && styles.darkMedicineName]}>{item.name}</Text>
          <Text style={[styles.medicineBrand, isDarkMode && styles.darkMedicineBrand]}>{item.brand}</Text>
          <Text style={[styles.medicineGeneric, isDarkMode && styles.darkMedicineGeneric]}>{item.genericName}</Text>
          <Text style={[
            styles.medicineStatus, 
            isDarkMode && styles.darkMedicineStatus,
            item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            {item.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      <View style={styles.medicineActions}>
        <TouchableOpacity 
          style={[styles.actionButton, isDarkMode && styles.darkActionButton]}
          onPress={() => toggleMedicineStatus(item.id)}
        >
          <Ionicons 
            name={item.status === 'active' ? 'pause' : 'play'} 
            size={20} 
            color={isDarkMode ? "#4ade80" : "#00835A"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isDarkMode && styles.darkActionButton]}
          onPress={() => deleteMedicine(item.id)}
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#4ade80" : "#00835A"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>Medicine Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <Ionicons name="search" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Search medicines..."
          placeholderTextColor={isDarkMode ? "#94a3b8" : "#999"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Medicine List */}
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        renderItem={renderMedicineItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={48} color={isDarkMode ? "#4ade80" : "#00835A"} />
            <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>No medicines found</Text>
          </View>
        }
      />

      {/* Add Medicine Button */}
      <TouchableOpacity style={[styles.addButton, isDarkMode && styles.darkAddButton]}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Medicine</Text>
      </TouchableOpacity>
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
    backgroundColor: '#f7fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  darkHeader: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  darkHeaderTitle: {
    color: '#e2e8f0',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  darkSearchContainer: {
    backgroundColor: '#1e293b',
    borderBottomColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    marginLeft: 8,
  },
  darkSearchInput: {
    color: '#e2e8f0',
  },
  listContainer: {
    padding: 16,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkMedicineItem: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicineAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  darkMedicineAvatar: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  darkMedicineName: {
    color: '#e2e8f0',
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
  medicineGeneric: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
  },
  darkMedicineGeneric: {
    color: '#94a3b8',
  },
  medicineStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  darkMedicineStatus: {
    color: '#e2e8f0',
  },
  activeStatus: {
    color: '#00835A',
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
  },
  inactiveStatus: {
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  medicineActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  darkActionButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 16,
  },
  darkEmptyText: {
    color: '#94a3b8',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00835A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  darkAddButton: {
    backgroundColor: '#0f4c3a',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MedicineManagementScreen;