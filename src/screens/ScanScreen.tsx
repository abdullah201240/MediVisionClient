import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type ScanContentProps = {
  onMedicineScan?: (medicineData: any) => void;
};

const ScanContent: React.FC<ScanContentProps> = ({ onMedicineScan }) => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);

  // Sample medicine data for different barcodes
  const medicineDatabase: any = {
    "1234567890128": {
      id: '1',
      name: 'Napa Extra',
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
    },
    "9876543210987": {
      id: '2',
      name: 'Paracetamol',
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
    }
  };

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
    
    // Check if we have medicine data for this barcode
    const medicineData = medicineDatabase[data];
    
    if (medicineData && onMedicineScan) {
      // Navigate to medicine details page
      onMedicineScan(medicineData);
    } else {
      // Show alert with scanned data
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
            onPress={async () => {
              if (cameraRef.current) {
                try {
                  const photo = await cameraRef.current.takePictureAsync();
                  console.log('Photo taken:', photo);
                  Alert.alert(t('photoTaken'), t('photoSavedToGallery'));
                } catch (error) {
                  console.error('Error taking photo:', error);
                  Alert.alert(t('error'), t('failedToTakePhoto'));
                }
              }
            }}
          >
            <View style={styles.captureInnerButton} />
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