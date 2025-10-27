import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
};

const UserManagementScreen = ({ onBackPress }: { onBackPress: () => void }) => {
  const { showAlert } = useAlert();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'user', status: 'inactive' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'user', status: 'active' },
    { id: '5', name: 'Alex Taylor', email: 'alex.taylor@example.com', role: 'user', status: 'active' },
    { id: '6', name: 'System Admin', email: 'admin@midivision.com', role: 'admin', status: 'active' },
    { id: '7', name: 'John Admin', email: 'john.admin@midivision.com', role: 'admin', status: 'active' },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
          : user
      )
    );
    
    showAlert({
      title: 'Success',
      message: 'User status updated successfully',
      type: 'success'
    });
  };

  const deleteUser = (userId: string) => {
    showAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
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
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            showAlert({
              title: 'Success',
              message: 'User deleted successfully',
              type: 'success'
            });
          },
          style: 'destructive',
        },
      ]
    });
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={[styles.userItem, isDarkMode && styles.darkUserItem]}>
      <View style={styles.userInfo}>
        <View style={[styles.userAvatar, isDarkMode && styles.darkUserAvatar]}>
          <Text style={[styles.avatarText, isDarkMode && styles.darkAvatarText]}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, isDarkMode && styles.darkUserName]}>{item.name}</Text>
          <Text style={[styles.userEmail, isDarkMode && styles.darkUserEmail]}>{item.email}</Text>
          <View style={styles.userMeta}>
            <Text style={[styles.userRole, isDarkMode && styles.darkUserRole]}>
              {item.role === 'admin' ? 'Administrator' : 'User'}
            </Text>
            <Text style={[
              styles.userStatus, 
              isDarkMode && styles.darkUserStatus,
              item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
            ]}>
              {item.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, isDarkMode && styles.darkActionButton]}
          onPress={() => toggleUserStatus(item.id)}
        >
          <Ionicons 
            name={item.status === 'active' ? 'pause' : 'play'} 
            size={20} 
            color={isDarkMode ? "#4ade80" : "#00835A"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isDarkMode && styles.darkActionButton]}
          onPress={() => deleteUser(item.id)}
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
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>User Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <Ionicons name="search" size={20} color={isDarkMode ? "#94a3b8" : "#999"} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Search users..."
          placeholderTextColor={isDarkMode ? "#94a3b8" : "#999"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={48} color={isDarkMode ? "#4ade80" : "#00835A"} />
            <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>No users found</Text>
          </View>
        }
      />
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
  userItem: {
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
  darkUserItem: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00835A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  darkUserAvatar: {
    backgroundColor: '#0f4c3a',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  darkAvatarText: {
    color: '#e2e8f0',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  darkUserName: {
    color: '#e2e8f0',
  },
  userEmail: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  darkUserEmail: {
    color: '#94a3b8',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    color: '#00835A',
    backgroundColor: 'rgba(0, 131, 90, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  darkUserRole: {
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  userStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkUserStatus: {
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
  userActions: {
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
});

export default UserManagementScreen;