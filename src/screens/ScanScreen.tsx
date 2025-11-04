import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../lib/api';
import { useAlert } from '../context/AlertContext';

type ScanContentProps = {
  onMedicineScan?: (medicineData: any) => void;
};

const ScanContent: React.FC<ScanContentProps> = ({ onMedicineScan }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const { showAlert } = useAlert();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.content} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.content}>
        <Text style={styles.permissionText}>{t('cameraPermissionRequired')}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>{t('allowCameraAccess')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanning(true);
    
    // In a real app, you would search for medicine by barcode
    // For now, we'll show an alert with the scanned data
    Alert.alert(
      t('barcodeScanned'),
      `${t('barcodeType')}: ${type}\n${t('data')}: ${data}`,
      [
        {
          text: t('ok'),
          onPress: () => setScanning(false),
        },
      ]
    );
  };

  const captureAndSearchMedicine = async () => {
    if (cameraRef.current && !processingImage) {
      try {
        setProcessingImage(true);
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo);
        
        // Search for medicine by image
        const response = await api.searchMedicineByImage(photo.uri);
        
        if (response.error) {
          showAlert({
            title: t('error'),
            message: response.error,
            type: 'error'
          });
          setProcessingImage(false);
          return;
        }
        
        if (response.data && response.data.length > 0) {
          // If we found matching medicines, pass them to the callback
          if (onMedicineScan) {
            onMedicineScan(response.data);
          }
        } else {
          // No matching medicines found
          showAlert({
            title: t('noMedicinesFound'),
            message: t('noMedicinesFoundMessage'),
            type: 'info'
          });
        }
      } catch (error) {
        console.error('Error capturing or searching medicine:', error);
        showAlert({
          title: t('error'),
          message: t('failedToSearchMedicine'),
          type: 'error'
        });
      } finally {
        setProcessingImage(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanning ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean8", "ean13", "pdf417", "code39", "code128"],
        }}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleContainer}>
            <View style={styles.leftOverlay} />
            <View style={styles.frame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
            <View style={styles.rightOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t('scanMedicineTitle')}</Text>
        </View>
        
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>1. {t('pointCamera')}</Text>
          <Text style={styles.instructionText}>2. {t('ensureVisible')}</Text>
          <Text style={styles.instructionText}>3. {t('tapScan')}</Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={captureAndSearchMedicine}
            disabled={processingImage}
          >
            {processingImage ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View style={styles.captureInnerButton} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#1a7f5e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250,
    alignItems: 'center',
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  frame: {
    width: 250,
    height: 250,
    borderColor: 'transparent',
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00FF00',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00FF00',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00FF00',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00FF00',
  },
  titleContainer: {
    position: 'absolute',
    top: 40, // Positioned above instructions
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  instructions: {
    position: 'absolute',
    top: 80, // Increased from 60 to account for header
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.9)', // Increased shadow opacity
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3, // Increased shadow radius
    fontWeight: '600', // Increased font weight
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Added background for better readability
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 80, // Increased from 40 to account for bottom navigation
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    padding: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default ScanContent;