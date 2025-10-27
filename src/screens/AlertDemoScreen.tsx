import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { Button } from 'react-native';

const AlertDemoScreen = () => {
  const { isDarkMode } = useTheme();
  const { showAlert } = useAlert();

  const showSuccessAlert = () => {
    showAlert({
      title: 'Success!',
      message: 'Your action was completed successfully.',
      type: 'success',
      actions: [
        {
          text: 'OK',
          onPress: () => console.log('Success alert dismissed'),
        },
      ],
    });
  };

  const showErrorAlert = () => {
    showAlert({
      title: 'Error!',
      message: 'Something went wrong. Please try again.',
      type: 'error',
      actions: [
        {
          text: 'Retry',
          onPress: () => console.log('Retry action'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancel action'),
        },
      ],
    });
  };

  const showWarningAlert = () => {
    showAlert({
      title: 'Warning!',
      message: 'This action cannot be undone. Please proceed with caution.',
      type: 'warning',
      actions: [
        {
          text: 'Proceed',
          style: 'destructive',
          onPress: () => console.log('Proceed action'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancel action'),
        },
      ],
    });
  };

  const showInfoAlert = () => {
    showAlert({
      title: 'Information',
      message: 'Here is some important information for you.',
      type: 'info',
      actions: [
        {
          text: 'Got it',
          onPress: () => console.log('Info alert dismissed'),
        },
      ],
    });
  };

  return (
    <ScrollView 
      style={[styles.container, isDarkMode && styles.darkContainer]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Alert Demo</Text>
      <Text style={[styles.description, isDarkMode && styles.darkDescription]}>
        Tap the buttons below to see different types of alerts with distinct colors and styling.
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Show Success Alert" 
          onPress={showSuccessAlert}
          color="#10B981"
        />
        <Button 
          title="Show Error Alert" 
          onPress={showErrorAlert}
          color="#EF4444"
        />
        <Button 
          title="Show Warning Alert" 
          onPress={showWarningAlert}
          color="#F59E0B"
        />
        <Button 
          title="Show Info Alert" 
          onPress={showInfoAlert}
          color="#3B82F6"
        />
      </View>
      
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, isDarkMode && styles.darkInfoTitle]}>Alert Types:</Text>
        <View style={styles.infoItem}>
          <View style={[styles.colorBox, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
            Success - Green alerts for successful actions
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.colorBox, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
            Error - Red alerts for errors and failures
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.colorBox, { backgroundColor: '#F59E0B' }]} />
          <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
            Warning - Yellow alerts for warnings and cautions
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.colorBox, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
            Info - Blue alerts for informational messages
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  darkTitle: {
    color: '#f1f5f9',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  darkDescription: {
    color: '#94a3b8',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  infoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  darkInfoSection: {
    backgroundColor: '#1e293b',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  darkInfoTitle: {
    color: '#f1f5f9',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  darkInfoText: {
    color: '#cbd5e1',
  },
});

export default AlertDemoScreen;